'use client';

import { useEffect, useState } from 'react';
import { Plus, Users, FileText, MessageCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api, { endpoints, handleApiError } from '@/lib/api';
import { Post } from '@/types/post';
import { User } from '@/types/auth';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import PostCard from '@/components/posts/PostCard';
import CreatePostModal from '@/components/posts/CreatePostModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatRelativeTime } from '@/lib/utils';

interface DashboardStats {
  totalPosts: number;
  myPosts: number;
  totalUsers: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    myPosts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent posts
      const postsResponse = await api.get(`${endpoints.posts.list}?limit=5`);
      setRecentPosts(postsResponse.data.posts || []);

      // Fetch user's posts count
      const myPostsResponse = await api.get(endpoints.posts.byUser(user!.id));
      
      // Fetch users count (if endpoint exists)
      let totalUsers = 0;
      try {
        const usersResponse = await api.get(endpoints.users.list);
        totalUsers = usersResponse.data.users?.length || 0;
      } catch (error) {
        // Users endpoint might not be implemented yet
        console.log('Users endpoint not available');
      }

      setStats({
        totalPosts: postsResponse.data.total || postsResponse.data.posts?.length || 0,
        myPosts: myPostsResponse.data.posts?.length || 0,
        totalUsers,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setRecentPosts(prev => [newPost, ...prev.slice(0, 4)]);
    setStats(prev => ({
      ...prev,
      totalPosts: prev.totalPosts + 1,
      myPosts: prev.myPosts + 1,
    }));
  };

  const handlePostDeleted = (postId: number) => {
    setRecentPosts(prev => prev.filter(post => post.id !== postId));
    setStats(prev => ({
      ...prev,
      totalPosts: prev.totalPosts - 1,
      myPosts: prev.myPosts - 1,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening in your community today.
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              Community posts
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Posts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myPosts}</div>
            <p className="text-xs text-muted-foreground">
              Your contributions
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers || '—'}</div>
            <p className="text-xs text-muted-foreground">
              Active users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>
                Latest posts from the community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={user!.id}
                    onPostDeleted={handlePostDeleted}
                    showActions={false}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No posts yet. Be the first to share something!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Future Features */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = '/posts'}
              >
                <FileText className="w-4 h-4 mr-2" />
                View My Posts
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = '/users'}
              >
                <Users className="w-4 h-4 mr-2" />
                Browse Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                Features we're working on
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-500">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Real-time Chat</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-500">
                <Users className="w-4 h-4" />
                <span className="text-sm">User Profiles</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-500">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Analytics Dashboard</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}