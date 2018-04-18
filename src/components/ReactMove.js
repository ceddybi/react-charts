import React, { Component } from 'react'
import { NodeGroup as RMNodeGroup } from 'react-move'
import { easeCubicOut } from 'd3-ease'

const defaultTiming = {
  duration: process.env.NODE_ENV === 'development' ? 0 : 300,
  ease: easeCubicOut,
}

export const NodeGroup = ({ timing, ...rest }) => (
  <RMNodeGroup timing={{ ...defaultTiming, ...timing }} {...rest} />
)

export const NewAnimate = ({
  values, render, children, ...rest
}) =>
  process.env.NODE_ENV === 'development' ? (
    render(values)
  ) : (
    <Animate start={values} update={values} render={render} {...rest}>
      {children}
    </Animate>
  )

export class Animate extends Component {
  static defaultProps = {
    show: true,
  }

  render () {
    const {
      show,
      start,
      enter,
      update,
      leave,
      children,
      render,
      timing = defaultTiming,
    } = this.props

    return (
      <RMNodeGroup
        data={show ? [true] : []}
        keyAccessor={d => d}
        start={typeof start === 'function' ? start : () => start}
        enter={typeof enter === 'function' ? enter : () => enter}
        update={typeof update === 'function' ? update : () => update}
        leave={typeof leave === 'function' ? leave : () => leave}
        timing={timing}
      >
        {inters => {
          if (!inters.length) {
            return null
          }
          const rendered = (render || children)(inters[0].state)
          return rendered ? React.Children.only(rendered) : null
        }}
      </RMNodeGroup>
    )
  }
}