import Lottie from "lottie-react";
import animationData from "../../assets/lottie/1.json";

const SignupLottie = () => {
  return (
    <div className="w-full">
      <Lottie animationData={animationData} loop={true} autoplay={true} />
    </div>
  );
};

export default SignupLottie;
