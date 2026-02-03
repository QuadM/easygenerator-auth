
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export default function Profile() {
  const { profile, signout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(isLoading) return;
    if (!isAuthenticated) {
      navigate({ to: '/signin' });
    }
  }, [isAuthenticated, navigate, isLoading]);

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
            {isLoading && <div>Loading...</div>}
            {!isLoading && isAuthenticated &&
              <div className="flex flex-col items-start grow w-full gap-6">
                <div className="flex flex-col items-start grow w-full gap-2">
                 <h2>ID</h2>
                 <b>{profile.data?.id}</b>
                </div>
                <div className="flex flex-col items-start grow w-full gap-2">
                 <h2>Username</h2>
                 <b>{profile.data?.username}</b>
                </div>
                <div className="flex flex-col items-start grow w-full gap-2">
                 <h2>Email</h2>
                 <b>{profile.data?.email}</b>
                </div>
              </div>
            }
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-2 border-t bg-muted/50 px-6 py-4">
            <Button onClick={() => signout.mutate()}>Sign out</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
