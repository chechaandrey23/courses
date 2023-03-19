import React from "react";
import {VisibilityContext} from "react-horizontal-scrolling-menu";
import {Backdrop, Box, IconButton, Fab} from '@mui/material';

function Arrow(props: any) {
  const {children, disabled, onClick, size, bgColor, type} = props;
  if(type == 'side') {
    return (<Box onClick={onClick} sx={{
      display: disabled ? "none" : "flex",
      height: '100%',
      opacity: 0.65,
      '&:hover': {
        opacity: 0.90,
      }
    }}>
      <Box sx={{
        width: size+'',
        backgroundColor: bgColor,
        cursor: "pointer",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'inherit',
      }}>{children}</Box>
    </Box>);
  } else if(type == 'fab') {// button
    return (<Box onClick={onClick} sx={{
      display: disabled ? "none" : "flex",
      height: 'fit-content',
      pl: 1,
      pr: 1,
    }}>
      <Fab sx={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        opacity: 0.90,
        '&:hover': {
          backgroundColor: bgColor,
          opacity: 0.75,
        }
      }}>{children}</Fab>
    </Box>);
  } else {
    throw new Error('Unknown type(fab or side): '+type);
  }
}

export function LeftArrow(props: any) {
  const {isFirstItemVisible, scrollPrev, visibleElements, initComplete, scrollContainer} = React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(!initComplete || (initComplete && isFirstItemVisible));

  React.useEffect(() => {
    if (visibleElements.length) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleElements]);

  React.useEffect(() => {
    if(scrollContainer.current) {
      const el = (scrollContainer.current?.parentNode as any)?.getElementsByClassName('react-horizontal-scrolling-menu--arrow-left')[0];
      el.style.top = props.type == 'fab'?'calc(50% - calc('+props.size+' / 2))':'0px';
      el.style.left = '0px';
      el.style.height = props.type == 'fab'?'fit-content':'100%';
      el.style.position = 'absolute';
      el.style.zIndex = '100';
    }
  }, []);

  return (<Arrow disabled={disabled}
                 onClick={() => scrollPrev()}
                 size={props.size}
                 bgColor={props.bgColor}
                 type={props.type}>
    {props.children}
  </Arrow>);
}

export function RightArrow(props: any) {
  const {isLastItemVisible, scrollNext, visibleElements, scrollContainer} = React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(!visibleElements.length && isLastItemVisible);

  React.useEffect(() => {
    if (visibleElements.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleElements]);

  React.useEffect(() => {
    if(scrollContainer.current) {
      const el = (scrollContainer.current?.parentNode as any)?.getElementsByClassName('react-horizontal-scrolling-menu--arrow-right')[0];
      el.style.top = props.type == 'fab'?'calc(50% - calc('+props.size+' / 2))':'0px';
      el.style.right = '0px';
      el.style.height = props.type == 'fab'?'fit-content':'100%';
      el.style.position = 'absolute';
      el.style.zIndex = '100';
    }
  }, []);

  return (<Arrow disabled={disabled}
                 onClick={() => scrollNext()}
                 size={props.size}
                 bgColor={props.bgColor}
                 type={props.type}>
    {props.children}
  </Arrow>);
}
