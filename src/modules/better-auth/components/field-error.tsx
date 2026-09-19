type props = {
  errors?: string[]
}

export function FieldError({ errors }: props) {
  if (!errors?.length) return null
  return <p className="text-xs text-destructive">{errors[0]}</p>
}
