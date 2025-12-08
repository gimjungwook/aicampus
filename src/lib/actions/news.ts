'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkAdminRole } from '@/lib/utils/admin'
import { revalidatePath } from 'next/cache'
import type {
  NewsPost,
  NewsTag,
  NewsComment,
  NewsPostWithDetails,
  NewsCommentWithAuthor,
  NewsPostFormData,
  NewsTagFormData,
  NewsFeedOptions,
  NewsFeedResponse,
} from '@/lib/types/news'
import type { AdminActionResult } from '@/lib/types/admin'

// ================================================
// 헬퍼 함수
// ================================================

async function requireAdminAction() {
  if (!(await checkAdminRole())) {
    throw new Error('Unauthorized')
  }
  return createAdminClient()
}

// ================================================
// 읽기 (공개)
// ================================================

// 뉴스 피드 목록 가져오기
export async function getNewsPosts(
  options: NewsFeedOptions = {}
): Promise<NewsFeedResponse> {
  const { tag, limit = 10, offset = 0 } = options
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 기본 쿼리
  let query = supabase
    .from('news_posts')
    .select(`
      *,
      author:profiles!news_posts_author_id_profiles_fkey(id, display_name:nickname, avatar_url),
      tags:news_post_tags(
        tag:news_tags(*)
      )
    `, { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // 태그 필터링 (서브쿼리로 처리)
  if (tag) {
    const { data: tagData } = await supabase
      .from('news_tags')
      .select('id')
      .eq('slug', tag)
      .single()

    if (tagData) {
      const { data: postIds } = await supabase
        .from('news_post_tags')
        .select('post_id')
        .eq('tag_id', tagData.id)

      if (postIds && postIds.length > 0) {
        query = query.in('id', postIds.map(p => p.post_id))
      } else {
        return { posts: [], hasMore: false, total: 0 }
      }
    }
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching news posts:', error.message, error.code, error.details)
    return { posts: [], hasMore: false, total: 0 }
  }

  if (!data || data.length === 0) {
    return { posts: [], hasMore: false, total: 0 }
  }

  const postIds = data.map(p => p.id)

  // 좋아요 수 가져오기
  const likesCountMap = new Map<string, number>()
  const { data: likesCountData } = await supabase
    .from('news_likes')
    .select('post_id')
    .in('post_id', postIds)

  if (likesCountData) {
    likesCountData.forEach(l => {
      likesCountMap.set(l.post_id, (likesCountMap.get(l.post_id) || 0) + 1)
    })
  }

  // 댓글 수 가져오기
  const commentsCountMap = new Map<string, number>()
  const { data: commentsCountData } = await supabase
    .from('news_comments')
    .select('post_id')
    .in('post_id', postIds)

  if (commentsCountData) {
    commentsCountData.forEach(c => {
      commentsCountMap.set(c.post_id, (commentsCountMap.get(c.post_id) || 0) + 1)
    })
  }

  // 현재 유저가 좋아요 했는지 확인
  let userLikes: Set<string> = new Set()
  if (user) {
    const { data: likesData } = await supabase
      .from('news_likes')
      .select('post_id')
      .eq('user_id', user.id)
      .in('post_id', postIds)

    if (likesData) {
      userLikes = new Set(likesData.map(l => l.post_id))
    }
  }

  // 데이터 변환
  const posts: NewsPostWithDetails[] = data.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    thumbnail_url: post.thumbnail_url,
    author_id: post.author_id,
    is_published: post.is_published,
    published_at: post.published_at,
    created_at: post.created_at,
    updated_at: post.updated_at,
    author: post.author || { id: post.author_id, display_name: null, avatar_url: null },
    tags: (post.tags || []).map((t: { tag: NewsTag }) => t.tag).filter(Boolean),
    likes_count: likesCountMap.get(post.id) || 0,
    comments_count: commentsCountMap.get(post.id) || 0,
    is_liked: userLikes.has(post.id),
  }))

  return {
    posts,
    hasMore: (count || 0) > offset + limit,
    total: count || 0,
  }
}

// 단일 뉴스 포스트 가져오기
export async function getNewsPostById(id: string): Promise<NewsPostWithDetails | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: post, error } = await supabase
    .from('news_posts')
    .select(`
      *,
      author:profiles!news_posts_author_id_profiles_fkey(id, display_name:nickname, avatar_url),
      tags:news_post_tags(
        tag:news_tags(*)
      )
    `)
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (error || !post) {
    console.error('Error fetching news post:', error?.message, error?.code)
    return null
  }

  // 좋아요 수 가져오기
  const { count: likesCount } = await supabase
    .from('news_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', id)

  // 댓글 수 가져오기
  const { count: commentsCount } = await supabase
    .from('news_comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', id)

  // 현재 유저가 좋아요 했는지 확인
  let isLiked = false
  if (user) {
    const { data: likeData } = await supabase
      .from('news_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .single()
    isLiked = !!likeData
  }

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    thumbnail_url: post.thumbnail_url,
    author_id: post.author_id,
    is_published: post.is_published,
    published_at: post.published_at,
    created_at: post.created_at,
    updated_at: post.updated_at,
    author: post.author || { id: post.author_id, display_name: null, avatar_url: null },
    tags: (post.tags || []).map((t: { tag: NewsTag }) => t.tag).filter(Boolean),
    likes_count: likesCount || 0,
    comments_count: commentsCount || 0,
    is_liked: isLiked,
  }
}

// 모든 태그 가져오기
export async function getNewsTags(): Promise<NewsTag[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('news_tags')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching news tags:', error)
    return []
  }

  return data || []
}

// 포스트의 댓글 목록 가져오기
export async function getNewsComments(postId: string): Promise<NewsCommentWithAuthor[]> {
  const supabase = await createClient()

  // 모든 댓글 가져오기 (부모 댓글과 대댓글 모두)
  const { data, error } = await supabase
    .from('news_comments')
    .select(`
      *,
      author:profiles!news_comments_user_id_profiles_fkey(id, display_name:nickname, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  // 트리 구조로 변환 (부모 댓글 아래에 대댓글 배치)
  const commentsMap = new Map<string, NewsCommentWithAuthor>()
  const rootComments: NewsCommentWithAuthor[] = []

  // 먼저 모든 댓글을 맵에 추가
  ;(data || []).forEach(comment => {
    const commentWithAuthor: NewsCommentWithAuthor = {
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      parent_id: comment.parent_id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      author: comment.author || { id: comment.user_id, display_name: null, avatar_url: null },
      replies: [],
    }
    commentsMap.set(comment.id, commentWithAuthor)
  })

  // 트리 구조 구성
  commentsMap.forEach(comment => {
    if (comment.parent_id) {
      const parent = commentsMap.get(comment.parent_id)
      if (parent) {
        parent.replies = parent.replies || []
        parent.replies.push(comment)
      }
    } else {
      rootComments.push(comment)
    }
  })

  return rootComments
}

// ================================================
// 좋아요 (로그인 필요)
// ================================================

export async function toggleNewsLike(postId: string): Promise<{ liked: boolean; count: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('로그인이 필요합니다')
  }

  // 기존 좋아요 확인
  const { data: existingLike } = await supabase
    .from('news_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existingLike) {
    // 좋아요 취소
    await supabase
      .from('news_likes')
      .delete()
      .eq('id', existingLike.id)
  } else {
    // 좋아요 추가
    await supabase
      .from('news_likes')
      .insert({ post_id: postId, user_id: user.id })
  }

  // 새 카운트 가져오기
  const { count } = await supabase
    .from('news_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  revalidatePath(`/feed/${postId}`)

  return {
    liked: !existingLike,
    count: count || 0,
  }
}

// ================================================
// 댓글 (로그인 필요)
// ================================================

export async function createNewsComment(
  postId: string,
  content: string,
  parentId?: string
): Promise<NewsCommentWithAuthor> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('로그인이 필요합니다')
  }

  // 대댓글인 경우, 부모 댓글이 루트 댓글인지 확인 (2단계까지만 허용)
  if (parentId) {
    const { data: parentComment } = await supabase
      .from('news_comments')
      .select('parent_id')
      .eq('id', parentId)
      .single()

    if (parentComment?.parent_id) {
      throw new Error('대댓글에는 답글을 달 수 없습니다')
    }
  }

  const { data, error } = await supabase
    .from('news_comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      parent_id: parentId || null,
      content,
    })
    .select(`
      *,
      author:profiles!news_comments_user_id_profiles_fkey(id, display_name:nickname, avatar_url)
    `)
    .single()

  if (error || !data) {
    throw new Error('댓글 작성에 실패했습니다')
  }

  revalidatePath(`/feed/${postId}`)

  return {
    id: data.id,
    post_id: data.post_id,
    user_id: data.user_id,
    parent_id: data.parent_id,
    content: data.content,
    created_at: data.created_at,
    updated_at: data.updated_at,
    author: data.author || { id: data.user_id, display_name: null, avatar_url: null },
    replies: [],
  }
}

export async function updateNewsComment(
  commentId: string,
  content: string
): Promise<NewsComment> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('로그인이 필요합니다')
  }

  const { data, error } = await supabase
    .from('news_comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .eq('user_id', user.id)  // 본인 댓글만 수정 가능
    .select()
    .single()

  if (error || !data) {
    throw new Error('댓글 수정에 실패했습니다')
  }

  revalidatePath(`/feed/${data.post_id}`)

  return data
}

export async function deleteNewsComment(commentId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('로그인이 필요합니다')
  }

  // 대댓글이 있는지 확인
  const { count } = await supabase
    .from('news_comments')
    .select('*', { count: 'exact', head: true })
    .eq('parent_id', commentId)

  if (count && count > 0) {
    throw new Error('대댓글이 있는 댓글은 삭제할 수 없습니다')
  }

  // post_id를 먼저 가져오기
  const { data: comment } = await supabase
    .from('news_comments')
    .select('post_id')
    .eq('id', commentId)
    .single()

  const { error } = await supabase
    .from('news_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)  // 본인 댓글만 삭제 가능

  if (error) {
    throw new Error('댓글 삭제에 실패했습니다')
  }

  if (comment) {
    revalidatePath(`/feed/${comment.post_id}`)
  }
}

// ================================================
// 관리자 전용
// ================================================

// 관리자용 포스트 목록 (발행 여부 상관없이)
export async function getAdminNewsPosts(): Promise<NewsPost[]> {
  const supabase = await requireAdminAction()

  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

// 관리자용 단일 포스트
export async function getAdminNewsPostById(id: string): Promise<NewsPost | null> {
  const supabase = await requireAdminAction()

  const { data, error } = await supabase
    .from('news_posts')
    .select(`
      *,
      tags:news_post_tags(tag_id)
    `)
    .eq('id', id)
    .single()

  if (error) {
    return null
  }

  return {
    ...data,
    tag_ids: data.tags?.map((t: { tag_id: string }) => t.tag_id) || [],
  }
}

// 뉴스 포스트 생성
export async function createNewsPost(
  formData: NewsPostFormData
): Promise<AdminActionResult<NewsPost>> {
  try {
    const supabase = await requireAdminAction()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { tag_ids, ...postData } = formData

    // 포스트 생성
    const { data: post, error: postError } = await supabase
      .from('news_posts')
      .insert({
        ...postData,
        author_id: user.id,
        published_at: formData.is_published ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (postError || !post) {
      throw new Error(postError?.message || '포스트 생성 실패')
    }

    // 태그 연결
    if (tag_ids && tag_ids.length > 0) {
      const tagLinks = tag_ids.map(tag_id => ({
        post_id: post.id,
        tag_id,
      }))

      const { error: tagError } = await supabase
        .from('news_post_tags')
        .insert(tagLinks)

      if (tagError) {
        console.error('Error linking tags:', tagError)
      }
    }

    revalidatePath('/feed')
    revalidatePath('/')

    return { success: true, data: post }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// 뉴스 포스트 수정
export async function updateNewsPost(
  id: string,
  formData: Partial<NewsPostFormData>
): Promise<AdminActionResult<NewsPost>> {
  try {
    const supabase = await requireAdminAction()

    const { tag_ids, ...postData } = formData

    // 발행 상태 변경 시 published_at 업데이트
    const updateData: Record<string, unknown> = {
      ...postData,
      updated_at: new Date().toISOString(),
    }

    if (formData.is_published !== undefined) {
      if (formData.is_published) {
        // 기존 published_at이 없으면 현재 시간으로 설정
        const { data: existing } = await supabase
          .from('news_posts')
          .select('published_at')
          .eq('id', id)
          .single()

        if (!existing?.published_at) {
          updateData.published_at = new Date().toISOString()
        }
      }
    }

    const { data: post, error: postError } = await supabase
      .from('news_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (postError || !post) {
      throw new Error(postError?.message || '포스트 수정 실패')
    }

    // 태그 업데이트
    if (tag_ids !== undefined) {
      // 기존 태그 삭제
      await supabase
        .from('news_post_tags')
        .delete()
        .eq('post_id', id)

      // 새 태그 연결
      if (tag_ids.length > 0) {
        const tagLinks = tag_ids.map(tag_id => ({
          post_id: id,
          tag_id,
        }))

        await supabase
          .from('news_post_tags')
          .insert(tagLinks)
      }
    }

    revalidatePath('/feed')
    revalidatePath(`/feed/${id}`)
    revalidatePath('/')

    return { success: true, data: post }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// 뉴스 포스트 삭제
export async function deleteNewsPost(id: string): Promise<AdminActionResult> {
  try {
    const supabase = await requireAdminAction()

    const { error } = await supabase
      .from('news_posts')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/feed')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// 태그 생성
export async function createNewsTag(
  formData: NewsTagFormData
): Promise<AdminActionResult<NewsTag>> {
  try {
    const supabase = await requireAdminAction()

    const { data, error } = await supabase
      .from('news_tags')
      .insert(formData)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/feed')

    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// 태그 삭제
export async function deleteNewsTag(id: string): Promise<AdminActionResult> {
  try {
    const supabase = await requireAdminAction()

    const { error } = await supabase
      .from('news_tags')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/feed')

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
