import { Button } from "@/components/ui/button";
import { useConnectStripeAccountMutation } from "@/redux/features/shop/shopApi";
import { useEffect } from "react";
import { FaStripeS } from "react-icons/fa";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function StripeConnect() {
  const navigate = useNavigate();
  const [
    connectStripeAccount,
    { data: stripeData, isLoading, isError, isSuccess, error },
  ] = useConnectStripeAccountMutation();

  const handleConnectStripe = async () => {
    connectStripeAccount(null);
  };

  console.log(stripeData, error);

  useEffect(() => {
    if (isSuccess && stripeData.data.url) {
      toast.success("Redirecting to Stripe...");
      window.location.href = stripeData.data.url;
    }
    if (isError && error) {
      toast.error("Failed to connect to Stripe.");
    }
  }, [isSuccess, stripeData, error, isError, navigate]);

  return (
    <section className="min-h-[80vh] flex items-center justify-center">
      <section className="max-w-sm mx-auto text-center p-8 border rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-semibold mb-3">Connect with stripe</h1>
          <p className="mb-6">
            This is the Payouts page where sellers can manage their withdraw
            methods.
          </p>
        </div>
        <Button
          onClick={handleConnectStripe}
          disabled={isLoading}
          variant={"secondary"}
          className="text-white cursor-pointer w-full"
        >
          Connect To Stripe <FaStripeS className="" />
        </Button>
      </section>
    </section>
  );
}
