import { useEffect, useState } from "react";
import axios from 'axios';

export default function Test({ name, age }) {
    const [products, setProducts] = useState([]); //For the GET request
    const [editedTitles, setEditedTitles] = useState({}); //updates titles
    const [newTitle, setNewTitle] = useState(""); // For creation (POST)


    useEffect(() => {
        //Gets the list pf products from Dummy JSON
        fetch("https://dummyjson.com/products/")
            .then((response) => response.json())
            //setProducts is used to update 
            .then((response) => setProducts(response.products))
            .catch((err) => console.log(err));
    }, []);  //Empty array displays the product list only once

    // Implementation Flow
     // [User clicks Delete button]
     // [Button triggers handleDelete(item.id)]
     // [handleDelete sends DELETE request to API]
     // [API deletes item]
     // [handleDelete removes item from UI]

    function handleDelete(id) {
        axios.delete(`https://dummyjson.com/products/${id}`)
            .then(response => console.log(response.data))
             //shows the products being deleted
            .then(() => { alert("Item Deleted") });

        //creates a new list without the delete products
        const updatedProducts = products.filter((product) => product.id !== id);

        //update new changes in the UI
        setProducts(updatedProducts);
    }

    // User types input in the field
    // [Click Button]
    // [Calls updateTitle(product.id, newTitle)]
    // [Axios sends PATCH]
    // [Receive updated item]
    // [Update React state with new title]
    // [UI shows the new title]

    // Decides what to do with the input the user enters
    function handleInput (id, value) {
        // setEditedTitles updates one field only
        setEditedTitles(function(prev) {
            return {
            ...prev, //keeps existing data
            [id]: value //updates the value of the product
            };
        });
    }

    //Sending the patch request
    function updateTitle(id) {
        const newTitle = editedTitles[id];
        // Use patch to update
        axios.patch(`https://dummyjson.com/products/${id}`, { title: newTitle })
            .then(function(response) {
                // updates the previous title with the new title
                const updated = products.map(function(product) {
                    return product.id === id ? { ...product, title: response.data.title } : product;
                });
                setProducts(updated);
            })
            .then(() => { alert("Title Updated"); })
            .catch((err) => console.log(err));
    };          

    // Create a new product with id
    // [User Types into Input Fields]
    // [onChange Handlers]
    // [setNewProduct]  ← useState({ title: '',description: '',price: '', ...etc})
    // User clicks [Add Product] Button
    // [handleAddProduct() Function]    
    // axios.post("https://dummyjson.com/products/add", newProduct)
    // DummyJSON receives product data and returns new product with ID
    // .then(response => setProducts([...products, response.data]))
    // New Product appears in the UI list


    //Dealts with the POST user input for the new title
    function handleNewTitle(value) {
        setNewTitle(value);
    }


    function createItem() {
        axios.post(`https://dummyjson.com/products/`, { title: newTitle })
            .then(response => {
              console.log(response.data);
                // Add the newly created product
                setProducts(prevProducts => [...prevProducts, response.data]);
                alert("Item Created");
                setNewTitle(""); //clears the input after creating an item
            })
            .catch(err => console.log(err));            
    }

    return (
        <div>
            <div className="home">
                <h2>Dummy Products</h2>
                <h2>***</h2>
            </div>
            <input // Field for Post new title
                            type="text" 
                            placeholder="Create New Item"
                            value={newTitle}
                            onChange={(e) => handleNewTitle(e.target.value)}
                            style={{ backgroundColor: "lightblue", color: "black" }} 
                        />
                        &nbsp;
                        <button // Button for Post Submit / Create new product
                            onClick={createItem}
                            style={{ backgroundColor: "lightblue", color: "black", border: "1px solid black", padding: "2px 2px", cursor: "pointer" }}
                        >Create Item Submit</button> 

            <ul>
                {products.map((product) => (
                    <li key={product.id || product.title}>
                        <button //Button to delete item altogether
                            onClick={() => handleDelete(product.id)}
                            style={{ padding: "5px 5px", backgroundColor: "#4B0082", color: "white", border: "none", borderRadius: "2px" }}
                        >Trash</button>
                        &nbsp; {product.id} - {product.title} &nbsp;
                        
                        <input 
                            type="text" // Input field to change the title, PUT aka update
                            placeholder="Change Title"
                            value={editedTitles[product.id] || ""}
                            onChange={(e) => handleInput(product.id, e.target.value)}
                            style={{ backgroundColor: "lightgray", color: "black" }} 
                        />
                        &nbsp;
                        <button //Button to submit the PUT change 
                            onClick={() => updateTitle(product.id)}
                            style={{ backgroundColor: "white", color: "black", border: "1px solid black", padding: "2px 2px", cursor: "pointer" }}
                        >Change Submit</button> 
                        &nbsp;
                    </li>    
                ))}
            </ul>
        </div>
    );
}