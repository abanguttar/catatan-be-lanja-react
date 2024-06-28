import { useState } from "react";
/**
 * Define value default
 */
// const groceryItems = [
//   {
//     id: 1,
//     name: "Kopi Bubuk",
//     quantity: 5,
//     checked: true,
//   },
//   {
//     id: 2,
//     name: "Gula Pasir",
//     quantity: 3,
//     checked: false,
//   },
//   {
//     id: 3,
//     name: "Air Mineral",
//     quantity: 1,
//     checked: false,
//   },
// ];

const KEY = "GROCERY-KEY";
const groceryItems = JSON.parse(sessionStorage.getItem(KEY)) ?? [];

export default function App() {
  /**
   * lets say groceryItems is data from database so use lifting state up
   *
   */
  const [items, setItems] = useState(groceryItems);
  // Create function to handle add new item
  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
    sessionStorage.setItem(KEY, JSON.stringify([...items, newItem]));
  };

  // Create function to handle delete item
  const handleDeleteItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    sessionStorage.setItem(KEY, JSON.stringify(newItems));
  };

  const handleToggleItem = (id) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(newItems);
    sessionStorage.setItem(KEY, JSON.stringify(newItems));
  };

  const handleDeleteAllItem = () => {
    setItems([]);
    sessionStorage.setItem(KEY, JSON.stringify([]));
  };

  return (
    <div className="app">
      <Header />

      {/* onAddItem => adalah props atau identifier sebuah event/trigger yang menghubungkan siblings */}
      <Form onAddItem={handleAddItem} />
      <GroceryList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onDeleteAllItem={handleDeleteAllItem}
      />
      <Footer items={items} />
    </div>
  );
}

const Header = () => {
  return <h1>Catatan Belanjaku 📝</h1>;
};

const Form = ({ onAddItem }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) return alert("Mohon isi nama barangnya ya ayang!");
    const newItem = {
      id: Date.now(),
      name: name,
      quantity: quantity,
      checked: false,
    };
    onAddItem(newItem);

    setName("");
    setQuantity(1);
  };

  // Make quantity use array map
  const quantitySelect = [...Array(10)].map((_, i) => (
    <option value={i + 1} key={i + 1}>
      {i + 1}
    </option>
  ));

  return (
    <>
      <form className="add-form" onSubmit={handleSubmit}>
        <h3>Hari ini belanja apa kita?</h3>
        <div>
          <select
            value={quantity}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
            }}
          >
            {quantitySelect}
          </select>
          <input
            type="text"
            placeholder="nama barang..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <button typeof="submit">Tambah</button>
        {/* <button type="button" onClick={() => handleSubmit()}>
          Tambah
        </button> */}
      </form>
    </>
  );
};

const GroceryList = ({
  items,
  onDeleteItem,
  onToggleItem,
  onDeleteAllItem,
}) => {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") {
    sortedItems = items;
  } else if (sortBy === "name") {
    sortedItems = items.slice().sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "checked") {
    sortedItems = items.filter((x) => x.checked === true);
  }

  return (
    <>
      <div className="list">
        <ul>
          {sortedItems.map((item) => (
            /**
             * key => setiap element harus memiliki unique key
             * Item data={item}
             * data => adalah variable yang digunakan dalam function untuk menangkap parsing sebuah data
             * disini akan dideklarasikan dan ditangkap dengan const Item = ({data}) => {}
             * item => element dari iterasi array map
             */
            <Item
              data={item}
              key={item.id}
              onDeleteItem={onDeleteItem}
              onToggleItem={onToggleItem}
            />
          ))}
        </ul>
      </div>
      <div className="actions">
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
          }}
        >
          <option value="input">Urutkan berdasarkan urutan input</option>
          <option value="name">Urutkan berdasarkan nama barang</option>
          <option value="checked">Urutkan berdasarkan ceklis</option>
        </select>
        <button onClick={() => onDeleteAllItem()}>Bersihkan Daftar</button>
      </div>
    </>
  );
};

const Footer = ({ items }) => {
  const total = items.length;
  const totalChecked = items.filter((x) => x.checked).length;
  const percentage =
    totalChecked === 0 ? 0 : Math.floor((totalChecked / total) * 100);
  return (
    <footer className="stats">
      Ada {total} barang di daftar belanjaan, {totalChecked} barang sudah dibeli
      {/* ({}%) */}({percentage}%)
    </footer>
  );
};

const Item = ({ data, onDeleteItem, onToggleItem }) => {
  return (
    <>
      <li key={data.id}>
        <input
          type="checkbox"
          checked={data.checked}
          onChange={() => onToggleItem(data.id)}
        />
        {/* gunakan {} satu kali untuk langsung memproses array, gunakan {{  }} untuk memanggil mode javascript */}
        <span style={data.checked ? { textDecoration: "line-through" } : {}}>
          {data.quantity} {data.name}
        </span>
        <button
          onClick={() => {
            onDeleteItem(data.id);
          }}
        >
          &times;
        </button>
      </li>
    </>
  );
};
