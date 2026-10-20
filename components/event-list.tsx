export function EventList({ events }: { events: string[] }) {
  if (events.length === 0) return <p>Nenhum evento registrado.</p>;
  return (
    <ol>
      {events.map((event) => (
        <li key={event}>{event}</li>
      ))}
    </ol>
  );
}
