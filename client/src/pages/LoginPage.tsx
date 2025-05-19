import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login, register as registerUser, googleLogin, selectAuth } from '@/store/authSlice';
import { AppDispatch } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/components/ui/theme-provider';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Form validation schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector(selectAuth);
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const { theme } = useTheme();

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isRegistering) {
        await dispatch(registerUser(data)).unwrap();
        toast({
          title: 'Account created',
          description: 'Your account has been created successfully.',
        });
      } else {
        await dispatch(login(data)).unwrap();
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const handleGoogleLogin = () => {
    // This is a simplified version. In reality, we would use a proper OAuth flow
    // with Google's authentication services. For now, we'll just simulate it.
    toast({
      title: 'Google login',
      description: 'Google login is not implemented in this demo.',
      variant: 'destructive',
    });
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    form.reset();
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-2 text-primary dark:text-neutral-100">
              Watch Dealer Portal
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300">
              Access your exclusive inventory
            </p>
          </div>
          
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6">
                {isRegistering ? 'Create an Account' : 'Sign In'}
              </h2>
              
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            type="email"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Password</FormLabel>
                          {!isRegistering && (
                            <Button
                              variant="link"
                              className="p-0 h-auto text-sm text-amber-500"
                              type="button"
                            >
                              Forgot password?
                            </Button>
                          )}
                        </div>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-light"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? 'Loading...'
                      : isRegistering
                      ? 'Create Account'
                      : 'Sign In'}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6">
                <div className="relative flex items-center justify-center">
                  <Separator className="absolute w-full" />
                  <span className="relative px-2 text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-800">
                    or continue with
                  </span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-6 flex items-center justify-center"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                    fill="#4285F4"
                  />
                </svg>
                Sign in with Google
              </Button>
              
              <div className="mt-6 text-center text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  {isRegistering
                    ? 'Already have an account?'
                    : "Don't have an account?"}
                </span>
                <Button
                  variant="link"
                  className="text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 p-0 h-auto ml-1"
                  onClick={toggleAuthMode}
                  type="button"
                >
                  {isRegistering ? 'Sign In' : 'Create an account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Login Background Image */}
      <div className="hidden md:block md:w-1/2 bg-cover bg-center">
        <div
          className="h-full"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1612015670817-0127d21628d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1200')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>
    </div>
  );
}
