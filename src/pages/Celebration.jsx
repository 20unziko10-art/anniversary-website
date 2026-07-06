import PageWrap from '../components/common/PageWrap'
import BookIntro from '../components/page3/BookIntro'
import MessageWall from '../components/page3/MessageWall'
import ParticleFinale from '../components/page3/ParticleFinale'
import LanternFinale from '../components/page3/LanternFinale'

export default function Celebration() {
  return (
    <PageWrap>
      <BookIntro />
      <MessageWall />
      <ParticleFinale />
      <LanternFinale />
    </PageWrap>
  )
}
