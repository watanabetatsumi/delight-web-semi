'use client';

import { useEffect, useState } from 'react';
import { Search, User, MessageCircle, Calendar, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api, { endpoints, handleApiError } from '@/lib/api';
import { User as UserType } from '@/types/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatDate, debounce } from '@/lib/utils';

interface UserWithStats extends UserType {
  post_count?: number;
  last_active?: string;
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounced search
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (searchQuery.trim()) {
        const filtered = users.filter(user => 
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(users);
      }
    }, 300);

    debouncedSearch();
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // This endpoint might not exist yet, so we'll handle the error gracefully
      const response = await api.get(endpoints.users.list);
      const usersData = response.data.users || [];
      
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // For now, we'll show a placeholder message
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (user: UserType) => {
    // This will be implemented when chat functionality is added
    alert(`Chat with ${user.username} - Coming soon!`);
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community Users</h1>
        <p className="text-gray-600">
          Connect with other members of the community
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="card-hover">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
                <CardTitle className="text-lg">{user.username}</CardTitle>
                <CardDescription className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined
                  </span>
                  <span>{formatDate(user.created_at)}</span>
                </div>

                {user.post_count !== undefined && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Posts</span>
                    <span className="font-medium">{user.post_count}</span>
                  </div>
                )}

                {user.last_active && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Last active</span>
                    <span>{formatDate(user.last_active)}</span>
                  </div>
                )}

                {user.id !== currentUser?.id && (
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleStartChat(user)}
                      disabled={true} // Disabled until chat is implemented
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat (Coming Soon)
                    </Button>
                  </div>
                )}

                {user.id === currentUser?.id && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-center text-sm text-primary-600 font-medium">
                      This is you!
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No users found' : 'No users available'}
              </h3>
              <p className="text-sm">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'The user directory is not available yet'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Future Chat Features Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <MessageCircle className="w-5 h-5 mr-2" />
            Coming Soon: Real-time Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-800 space-y-2">
            <p>We're working on exciting chat features that will allow you to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Send direct messages to other users</li>
              <li>Create group conversations</li>
              <li>Share files and images</li>
              <li>Get real-time notifications</li>
              <li>See who's online</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}