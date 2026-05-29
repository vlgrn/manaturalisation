import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { forwardRef } from 'react'

// Styled native <select> that matches the Catalyst Input look.
// Uses Headless UI's Select for accessible disabled / invalid states.
export const Select = forwardRef(function Select(
  { className, ...props }: Omit<Headless.SelectProps, 'as' | 'className'> & { className?: string },
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  return (
    <span
      data-slot="control"
      className={clsx([
        className,
        'relative block w-full',
        // White inner background with shadow
        'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
        'dark:before:hidden',
        // Focus ring
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500',
        // Disabled state
        'has-data-disabled:opacity-50 has-data-disabled:before:bg-zinc-950/5 has-data-disabled:before:shadow-none',
      ])}
    >
      <Headless.Select
        ref={ref}
        {...props}
        className={clsx([
          // Base layout — matches Input sizing
          'relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
          // Typography
          'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white dark:*:text-white',
          // Border
          'border border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20',
          // Background
          'bg-transparent dark:bg-white/5',
          // Focus
          'focus:outline-hidden',
          // Invalid
          'data-invalid:border-red-500 data-invalid:data-hover:border-red-500',
          // Chevron icon space on the right
          'pr-8',
        ])}
      />
      {/* Down-chevron indicator */}
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg className="size-5 stroke-zinc-500 sm:size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M5.75 10.75L8 13L10.25 10.75" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.25 5.25L8 3L5.75 5.25" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  )
})
