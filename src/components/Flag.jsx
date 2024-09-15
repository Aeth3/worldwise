export default function Flag({flag}) {
  if (!flag) return null;
  const countryCode = flag.toLowerCase();
  return <img src={`https://flagcdn.com/24x18/${countryCode}.png`}/>
}
