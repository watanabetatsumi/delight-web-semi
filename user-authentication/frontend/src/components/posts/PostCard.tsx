'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, User, MoreHorizontal } from 'lucide-react';
import { Post } from '@/types/post';
import { formatRelativeTime, truncateText } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface PostCardProps {
  post: Post;
  currentUserId: number;
  onPostDeleted?: (postId: number) => void;
  onPostUpdated?: (post: Post) => void;
  showActions?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onPostDeleted,
  onPostUpdated,
  showActions = true,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = post.user_id === currentUserId;
  const shouldTruncate = post.content.length > 200;
  const displayContent = shouldTruncate && !showFullContent 
    ? truncateText(post.content, 200)
    : post.content;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // This would be implemented in a parent component or hook
        onPostDeleted?.(post.id);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {post.author || `User ${post.user_id}`}
              </p>
              <p className="text-xs text-gray-500">
                {formatRelativeTime(post.created_at)}
              </p>
            </div>
          </div>

          {showActions && isOwner && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        // Handle edit - would open edit modal
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="text-gray-800 whitespace-pre-wrap">
            {displayContent}
          </p>
          
          {shouldTruncate && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
            >
              {showFullContent ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {post.updated_at !== post.created_at && (
          <p className="text-xs text-gray-400 mt-3">
            Edited {formatRelativeTime(post.updated_at)}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;