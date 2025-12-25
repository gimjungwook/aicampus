-- ================================================
-- course_reviews -> profiles foreign key 추가
-- PostgREST 조인을 위해 필요
-- ================================================

-- course_reviews.user_id -> profiles.id foreign key
ALTER TABLE course_reviews
ADD CONSTRAINT course_reviews_user_profiles_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- review_replies.user_id -> profiles.id foreign key
ALTER TABLE review_replies
ADD CONSTRAINT review_replies_user_profiles_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
