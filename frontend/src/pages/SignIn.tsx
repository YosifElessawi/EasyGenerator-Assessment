import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '@/services/auth';
import type { RootState, AppDispatch } from '@/store/store';
import { AuthForm, type SignInFormData } from '@/components/forms/AuthForm';

const SignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => ({
    isLoading: state.auth.isLoading,
    error: state.auth.error,
  }));

  const handleSubmit = async (values: SignInFormData) => {
    try {
      await dispatch(signIn({
        email: values.email,
        password: values.password,
      })).unwrap();
      navigate('/app');
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthForm
        type="signin"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        switchAuthType={() => navigate('/signup')}
      />
    </div>
  );
};

export default SignIn;