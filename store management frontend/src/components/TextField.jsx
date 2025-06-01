export default function TextField({
  register,
  registerName,
  label,
  placeholder,
  required,
  type,
  className,
  error,
}) {
  return (
    <div>
      <input
        {...register("password")}
        name="password"
        type="password"
        placeholder="Password"
      />
      <p className="text-red text-sm ">{error}</p>
    </div>
  );
}
