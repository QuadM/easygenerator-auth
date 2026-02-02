import { useAuth } from "../hooks/useAuth";
import { signupSchema } from "../domain/schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignUp() {
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = (data: SignupFormValues) => {
    signup.mutate(data, {
      onError: (err: Error & { response?: { data?: { message?: string | string[] } } }) => {
        const message =
          err?.response?.data?.message || err?.message || "Invalid credentials";
        toast.error(Array.isArray(message) ? message[0] : message);
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-start w-full gap-4">
                <div className="flex flex-col items-start w-full gap-2">
                  <Label htmlFor="username">Full Name</Label>
                  <Input
                    className=" hover:border-[#2cbd9a] hover:shadow-[0_1px_0_0_#2cbd9a] focus:border-[#2cbd9a] focus:shadow-[0_1px_0_0_#2cbd9a]"
                    id="username"
                    placeholder="John Doe"
                    {...register("username")}
                    required
                  />
                  {errors.username && (
                    <span className="text-xs text-destructive font-medium">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start w-full gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className=" hover:border-[#2cbd9a] hover:shadow-[0_1px_0_0_#2cbd9a] focus:border-[#2cbd9a] focus:shadow-[0_1px_0_0_#2cbd9a]"
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

                <div className="flex flex-col items-start w-full gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    className=" hover:border-[#2cbd9a] hover:shadow-[0_1px_0_0_#2cbd9a] focus:border-[#2cbd9a] focus:shadow-[0_1px_0_0_#2cbd9a]"
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
                  className="rounded-full w-full bg-linear-to-r from-[#2cbd9a] to-[#65c86d] text-lg p-6!"
                  disabled={signup.isPending || !isValid}
                >
                  {signup.isPending ? "Creating account..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-2 border-t bg-muted/50 px-6 py-4">
            <span className="text-sm text-muted-foreground">
              Already have an account?
            </span>
            <Link
              to="/signin"
              className="text-sm font-medium underline underline-offset-4 hover:text-primary"
            >
              Log in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
