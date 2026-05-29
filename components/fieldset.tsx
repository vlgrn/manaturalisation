import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import type React from 'react'

// Wraps a group of form fields with optional disabled state.
export function Fieldset({
  className,
  ...props
}: { className?: string; disabled?: boolean } & Omit<Headless.FieldsetProps, 'as' | 'className'>) {
  return (
    <Headless.Fieldset
      {...props}
      className={clsx(className, '[&>*+[data-slot=control]]:mt-8 [&>[data-slot=text]]:mt-1')}
    />
  )
}

// Styled <legend> for a Fieldset — renders as a section heading.
export function Legend({ className, ...props }: { className?: string } & Omit<Headless.LegendProps, 'as' | 'className'>) {
  return (
    <Headless.Legend
      data-slot="legend"
      {...props}
      className={clsx(
        className,
        'text-base/6 font-semibold text-zinc-950 data-disabled:opacity-50 sm:text-sm/6 dark:text-white'
      )}
    />
  )
}

// Visible label for a single Field. Associates with the control via Headless UI.
export function Label({ className, ...props }: { className?: string } & Omit<Headless.LabelProps, 'as' | 'className'>) {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      className={clsx(
        className,
        'select-none text-base/6 text-zinc-950 data-disabled:opacity-50 sm:text-sm/6 dark:text-white'
      )}
    />
  )
}

// Helper text rendered below a label or above a control.
export function Description({
  className,
  ...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'as' | 'className'>) {
  return (
    <Headless.Description
      data-slot="text"
      {...props}
      className={clsx(
        className,
        'text-base/6 text-zinc-500 data-disabled:opacity-50 sm:text-sm/6 dark:text-zinc-400'
      )}
    />
  )
}

// Groups a label + control + description into one accessible unit.
export function Field({ className, ...props }: { className?: string } & Omit<Headless.FieldProps, 'as' | 'className'>) {
  return (
    <Headless.Field
      className={clsx(
        className,
        '[&>[data-slot=label]+[data-slot=control]]:mt-3',
        '[&>[data-slot=label]+[data-slot=text]]:mt-1',
        '[&>[data-slot=text]+[data-slot=control]]:mt-3',
        '[&>[data-slot=control]+[data-slot=text]]:mt-3',
        '[&>[data-slot=control]+[data-slot=error]]:mt-3',
        '[&>[data-slot=label]]:font-medium'
      )}
      {...props}
    />
  )
}

// Visual separator between fields in a form section.
export function FieldGroup({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div data-slot="control" {...props} className={clsx(className, 'flex flex-col gap-10')} />
}
