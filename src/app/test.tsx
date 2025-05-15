import { useEffect, useState } from "react";

export default function Test({ name, age }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("https://dummyjson.com/products/")
        .then((response) => response.json()) //converts the API response to JSON
        .then((response) => setProducts(response.products))
        .catch((err) => console.log(err));
    }, []); //Empty array displays the product list only once

    function handleDelete(id) {
        //shows the products being deleted
        console.log('delete', id);

        //creates a new list without the delete products
        const updatedProducts = products.filter((product) => product.id !==id);

        //update new changes in the UI
        setProducts(updatedProducts);
    
    }

    return (
        <div>
            <div className="home">
            <h2>Dummy Products</h2>
            <h2>***</h2>
            </div>
            
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <button 
                            onClick={() => handleDelete(product.id)}
                            style={{ padding: "5px 5px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "2px" }}
                        >Trash</button>  

                - {product.id} - {product.title}
                </li> 
            ))}
            </ul>
        </div>
    )
}