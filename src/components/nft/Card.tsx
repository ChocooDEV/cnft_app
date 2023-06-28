import React from "react";

const Card = ({ nft }) => {
  const { name, compressed, json_uri, attributes, metadata } = nft;
  const imageUrl = metadata?.image;

  return (
    <div className="card">
      <div className="card-image">
        <div className="image-container">
          <img src={imageUrl} alt={name} />
        </div>
        <div className={`card-compression-badge ${compressed ? "compressed" : "not-compressed"}`}>
          {compressed ? "COMPRESSED" : "NOT COMPRESSED"}
        </div>
      </div>
      <div className="card-content">
        <h2 className="card-title">{name}</h2>
        <div className="card-details">
          <ul className="card-attributes">
            {attributes.map((attribute, index) => (
              <li key={index}>
                <strong>{attribute.traitType}: </strong>
                {attribute.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Card;
