import ColorBox from "./ColorBox";

const Color = ({ props }) => {
  return (
    <div>
      {
        props.value.value
        ? <ColorBox value={props.value.value}/>
        : null
      }
    </div>
  )
};

export default Color;