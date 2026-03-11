export default function FeatureHighlights() {
  const items = [
    {
      title: "Chất liệu dễ mặc",
      desc: "Ưu tiên cotton, form hiện đại và dễ phối trong nhiều hoàn cảnh.",
    },
    {
      title: "Phong cách tối giản",
      desc: "Các thiết kế basic, trẻ trung, phù hợp đi học, đi làm và đi chơi.",
    },
    {
      title: "Mua sắm thuận tiện",
      desc: "Xem sản phẩm, thêm giỏ hàng và đặt hàng nhanh trên một giao diện gọn gàng.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-white border rounded-3xl p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-gray-600 leading-7">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
