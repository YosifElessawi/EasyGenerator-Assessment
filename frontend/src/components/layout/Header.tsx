import { Button } from "@/components/ui/button";
import { useDispatch } from 'react-redux';
import { LogOut } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { AppDispatch } from '@/store/store';


const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    dispatch(LogOut());
    navigate('/signin');
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
      <div className="container flex h-14 items-center w-11/12">
        <div className="mr-4 hidden md:flex">
          <h1 className="text-lg font-semibold">EasyGenerator</h1>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
