export function WorkflowList({
  items,
}: {
  items: Array<{ title: string; body: string }>;
}) {
  return (
    <ol className="workflow-list">
      {items.map((item, index) => (
        <li className="workflow-item" key={item.title}>
          <span className="workflow-index">{index + 1}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

