import ColorBox from "./ColorBox";

const Product = ({ props }) => {
  return (
    <div>
      {props.value.sku} {props.value.fabric.name} {props.value.design ? props.value.design.name : ''}
      {
        props.value.color
        ? <ColorBox value={props.value.color.value}/>
        : null
      }
    </div>
  )
};

export default Product;