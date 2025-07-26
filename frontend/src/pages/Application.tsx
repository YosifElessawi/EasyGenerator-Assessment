import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Application = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 mx-auto">
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Welcome back, {user.name}!
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">+0% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">+0% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="min-h-[300px]">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent activities will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-muted-foreground">
              <p>No recent activity</p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Application;
