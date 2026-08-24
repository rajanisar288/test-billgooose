'use client';

import type { FormEvent, MouseEvent, ReactNode } from 'react';

import { IS_PRODUCTION_MODE } from '@/lib/site-mode';

type ShowcaseGuardProps = {
  children: ReactNode;
};

export default function ShowcaseGuard({ children }: ShowcaseGuardProps) {
  /*
   * UAT:
   * render everything normally.
   */
  if (!IS_PRODUCTION_MODE) {
    return children;
  }

  /*
   * SHOWCASE:
   * intercept interactive elements before
   * their own click handlers execute.
   */
  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    const interactiveElement = target.closest(
      `
        a,
        button,
        [role="button"],
        [role="link"],
        input[type="submit"],
        input[type="button"]
      `,
    );

    if (!interactiveElement) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  const handleSubmitCapture = (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      data-site-mode="PRODUCTION"
      className="min-h-screen"
      onClickCapture={handleClickCapture}
      onSubmitCapture={handleSubmitCapture}
    >
      {children}
    </div>
  );
}
