'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api, { endpoints, handleApiError } from '@/lib/api';
import { createPostSchema, type CreatePostFormData } from '@/lib/validations';
import { Post } from '@/types/post';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  });

  const content = watch('content', '');
  const remainingChars = 1000 - content.length;

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      const response = await api.post(endpoints.posts.create, data);
      const newPost = response.data;
      
      onPostCreated(newPost);
      toast.success('Post created successfully!');
      onClose();
      reset();
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg animate-slide-up">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Create New Post</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <textarea
                  {...register('content')}
                  placeholder="What's on your mind?"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  disabled={isSubmitting}
                />
                {errors.content && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.content.message}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Share your thoughts with the community
                  </p>
                  <p className={`text-xs ${remainingChars < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {remainingChars} characters remaining
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting || remainingChars < 0 || !content.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePostModal;