'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api, { endpoints, handleApiError } from '@/lib/api';
import { Post } from '@/types/post';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import PostCard from '@/components/posts/PostCard';
import CreatePostModal from '@/components/posts/CreatePostModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { debounce } from '@/lib/utils';

export default function PostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'mine'>('mine');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  // Debounced search
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (searchQuery.trim()) {
        searchPosts(searchQuery);
      } else {
        fetchPosts();
      }
    }, 300);

    debouncedSearch();
  }, [searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let endpoint = endpoints.posts.list;
      
      if (filter === 'mine') {
        endpoint = endpoints.posts.byUser(user!.id);
      }

      const response = await api.get(endpoint);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async (query: string) => {
    try {
      setLoading(true);
      // This would need to be implemented in the backend
      const response = await api.get(`${endpoints.posts.list}?search=${encodeURIComponent(query)}`);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to search posts:', error);
      // Fallback to client-side filtering
      const filteredPosts = posts.filter(post => 
        post.content.toLowerCase().includes(query.toLowerCase())
      );
      setPosts(filteredPosts);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostDeleted = async (postId: number) => {
    try {
      await api.delete(endpoints.posts.delete(postId));
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      const message = handleApiError(error);
      console.error('Failed to delete post:', message);
    }
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {filter === 'mine' ? 'My Posts' : 'All Posts'}
          </h1>
          <p className="text-gray-600">
            {filter === 'mine' 
              ? 'Manage your posts and see your contributions'
              : 'Browse all posts from the community'
            }
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'mine' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('mine')}
              >
                My Posts
              </Button>
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Posts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user!.id}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery 
                  ? 'No posts found' 
                  : filter === 'mine' 
                    ? 'No posts yet' 
                    : 'No posts in the community'
                }
              </h3>
              <p className="text-sm mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : filter === 'mine'
                    ? 'Create your first post to get started'
                    : 'Be the first to share something with the community'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}