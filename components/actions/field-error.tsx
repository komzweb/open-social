export default function FieldError({ errors }: { errors: string[] }) {
  return (
    <ul className="ml-4 list-disc">
      {errors.map((message: string) => (
        <li key={message} className="mt-1 text-xs text-red-600">
          {message}
        </li>
      ))}
    </ul>
  )
}
