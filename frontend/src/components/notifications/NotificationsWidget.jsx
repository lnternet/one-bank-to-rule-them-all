const notifications = [
  {
    id: "deposit",
    title: "Deposit cleared",
    description: "Salary payment posted to Everyday Checking.",
  },
  {
    id: "card",
    title: "Card payment due",
    description: "Blue Card minimum payment is due in 4 days.",
  },
  {
    id: "investments",
    title: "Portfolio update",
    description: "Your index fund allocation is up this week.",
  },
];

export default function NotificationsWidget() {
  return (
    <section className="widget notifications-widget" aria-labelledby="notifications-title">
      <div className="widget-header">
        <div>
          <p className="section-label">Inbox</p>
          <h2 id="notifications-title">Notifications</h2>
        </div>
        <span className="notification-count">{notifications.length}</span>
      </div>

      <ul className="notification-list">
        {notifications.map((notification) => (
          <li className="notification-item" key={notification.id}>
            <span className="notification-dot" aria-hidden="true" />
            <div>
              <strong>{notification.title}</strong>
              <span>{notification.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
