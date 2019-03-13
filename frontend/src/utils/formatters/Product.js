import ColorBox from "./ColorBox";

const Product = ({ props }) => {
  return (
    <div data-toggle={props.dataToggle} data-target={props.dataTarget} aria-controls={props.ariaControls} aria-expanded={props.ariaExpanded}>
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