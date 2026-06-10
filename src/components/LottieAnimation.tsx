"use client";

import { useEffect, useState } from "react";
import Lottie, { LottieComponentProps } from "lottie-react";

interface Props extends Omit<LottieComponentProps, "animationData"> {
  src: string;        // filename under /public/animations/, e.g. "confetti.json"
  className?: string;
}

export default function LottieAnimation({ src, className, ...rest }: Props) {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    fetch(`/animations/${src}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [src]);

  if (!data) return null;

  return (
    <Lottie
      animationData={data}
      className={className}
      {...rest}
    />
  );
}
