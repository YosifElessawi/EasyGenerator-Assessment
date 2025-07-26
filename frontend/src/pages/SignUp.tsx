import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '@/services/auth';
import type { RootState, AppDispatch } from '@/store/store';
import { AuthForm, type SignUpFormData } from '@/components/forms/AuthForm';

const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => ({
    isLoading: state.auth.isLoading,
    error: state.auth.error,
  }));

  const handleSubmit = async (values: SignUpFormData) => {
    try {
      await dispatch(signUp({
        email: values.email,
        name: values.name,
        password: values.password,
      })).unwrap();
      navigate('/app');
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthForm
        type="signup"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        switchAuthType={() => navigate('/signin')}
      />
    </div>
  );
};

export default SignUp;