const OrderCard = ({ order }) => {
  const { user, room, total, items, notes } = order;

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-bold">{user.name}</h4>
          <p className="text-sm text-gray-500">Order #{order.id}</p>
        </div>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">New</span>
      </div>
      <div className="text-sm text-gray-700 mb-2">
        <p><strong>Room:</strong> {room}</p>
        <p><strong>Total payment:</strong> ${total.toFixed(2)}</p>
      </div>
      <ul className="mb-2">
        {items.slice(0, 2).map((item, index) => (
          <li key={index} className="flex justify-between">
            <span>{item.name}</span>
            <span>{item.qty}x</span>
          </li>
        ))}
        {items.length > 2 && <p className="text-sm text-gray-400">+{items.length - 2} more items</p>}
      </ul>
      <p className="text-gray-500 text-sm italic mb-3">{notes}</p>
      <button className="text-sm bg-black text-white px-4 py-1 rounded">Order details →</button>
    </div>
  );
};

export default OrderCard;