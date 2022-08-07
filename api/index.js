import BossMember from "./bossMember"
import WithdrawAdmin from "./withdrawAdmin"
import AddressCenter from "./addressCenter"
import BossAssetsCenter from "./bossAssetsCenter"

const bossMember = new BossMember()
const withdrawAdmin = new WithdrawAdmin()
const addressCenter = new AddressCenter()
const bossAssetsCenter = new BossAssetsCenter()

export  {
  bossMember,
  withdrawAdmin,
  addressCenter,
  bossAssetsCenter
}