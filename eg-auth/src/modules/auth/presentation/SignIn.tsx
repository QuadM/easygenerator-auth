import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { signinSchema } from "../domain/schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

type SigninFormValues = z.infer<typeof signinSchema>;

export default function SignIn() {
  const { signin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/me" });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: SigninFormValues) => {
    signin.mutate(data, {
      onError: (err: any) => {
        const message =
          err?.response?.data?.message || err?.message || "Invalid credentials";
        toast.error(Array.isArray(message) ? message[0] : message);
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-[#363e4e]">
              Welcome back
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-start grow w-full gap-6">
                <div className="flex flex-col items-start grow w-full gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className=" hover:border-[#4e82fb] hover:shadow-[0_1px_0_0_#4e82fb] focus:border-[#4e82fb] focus:shadow-[0_1px_0_0_#4e82fb]"
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                    required
                  />
                  {errors.email && (
                    <span className="text-xs text-destructive font-medium">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start grow w-full gap-2">
                  <div className="flex justify-between w-full">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    className=" hover:border-[#4e82fb] hover:shadow-[0_1px_0_0_#4e82fb] focus:border-[#4e82fb] focus:shadow-[0_1px_0_0_#4e82fb]"
                    id="password"
                    type="password"
                    {...register("password")}
                    required
                  />
                  {errors.password && (
                    <span className="text-xs text-destructive font-medium">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  className="rounded-full w-full bg-linear-to-r from-[#4e82fb] to-[#5ebeff] text-lg p-6!"
                  disabled={signin.isPending || !isValid}
                >
                  {signin.isPending ? "Signing in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-2 border-t bg-muted/50 px-6 py-4">
            <span className="text-sm text-muted-foreground">
              Don't have an account?
            </span>
            <Link to="/signup" className="text-sm font-medium hover:underline">
              Sign up
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
