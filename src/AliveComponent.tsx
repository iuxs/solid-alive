import { JSX } from 'solid-js'
import aliveTransfer from './aliveTransfer'

export function AliveComponent(props: {
  children: JSX.Element
  id: string
  subIds?: Array<string>
}) {
  var Alive = aliveTransfer(() => props.children, props.id, props.subIds)

  return <Alive />
}
