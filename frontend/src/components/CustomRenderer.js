const CustomRenderer = ({ props }) => {
  return (
    <props.renderer {...{ props }}/>
  );
}

export default CustomRenderer;