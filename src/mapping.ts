import { Address, BigInt, Bytes, ethereum, log, store } from '@graphprotocol/graph-ts';
import {
    CatRescued as CatRescuedEvent,
    CatNamed as CatNamedEvent,
    CatAdopted as CatAdoptedEvent,
    AdoptionOffered as CatAdoptionOfferedEvent,
    AdoptionOfferCancelled as CatAdoptionOfferCancelledEvent,
    AdoptionRequested as CatAdoptionRequestedEvent,
    AdoptionRequestCancelled as CatAdoptionRequestCancelledEvent,
    GenesisCatsAdded as GenesisCatsAddedEvent,
} from '../generated/MoonCatRescue/MoonCatRescue';
import {
    Wrapped as CatWrappedEvent,
    Unwrapped as CatUnwrappedEvent,
} from '../generated/MoonCatsWrapped/MoonCatsWrapped';
import {
    Cat as CatEntity,
    Ask as AskEntity,
    Bid as BidEntity,
    Adoption as AdoptionEntity,
    Owner as OwnerEntity,
    Bidder as BidderEntity,
    RescueIndex as RescueIndexEntity,
} from '../generated/schema';

let ZERO = BigInt.fromI32(0);
let NULL_ADDRESS = Address.fromHexString('0x0000000000000000000000000000000000000000') as Address;
let RESCUE_INDEX_ID = 'RESCUE_INDEX';
let WRAPPER_ADDRESS = Address.fromHexString('0x7c40c393dc0f283f318791d746d894ddd3693572') as Address;

export function handleGenesisCatsAddedEvent(event: GenesisCatsAddedEvent): void {
    let catIds = event.params.catIds;

    let owner = getOrCreateOwnerEntity(NULL_ADDRESS);
    owner.catCount = (owner.catCount + catIds.length) as i32;
    owner.save();

    let rescueIndex = getRescueIndex();
    for (let i = 0; i < catIds.length; ++i, ++rescueIndex) {
        let catIdHex = catIds[i].toHex();
        log.debug('minting genesis cat {}', [catIdHex]);
        let cat = new CatEntity(catIdHex);
        cat.catId = catIdHex;
        cat.rescueTime = event.block.timestamp.toI32();
        cat.rescueBlock = event.block.number.toI32();
        cat.rescueIndex = rescueIndex as i32;
        cat.maxAdoptionPrice = ZERO;
        cat.rescuer = owner.id;
        cat.owner = owner.id;
        cat.isGenesis = true;
        cat.save();
    }
    saveRescueIndex(rescueIndex);
}
export function handleCatRescuedEvent(event: CatRescuedEvent): void {
    let catIdHex = event.params.catId.toHex();
    log.debug('rescuing cat {}', [catIdHex]);

    let owner = getOrCreateOwnerEntity(event.params.to);
    owner.catCount = (owner.catCount + 1) as i32;
    owner.save();

    let rescueIndex = getRescueIndex();
    let cat = new CatEntity(catIdHex);
    cat.catId = catIdHex;
    cat.rescueTime = event.block.timestamp.toI32();
    cat.rescueBlock = event.block.number.toI32();
    cat.rescueIndex = rescueIndex++ as i32;
    cat.maxAdoptionPrice = ZERO;
    cat.rescuer = owner.id;
    cat.owner = owner.id;
    cat.isGenesis = false;
    cat.save();
    saveRescueIndex(rescueIndex);
}

export function handleCatNamedEvent(event: CatNamedEvent): void {
    let catIdHex = event.params.catId.toHex();
    let cat = getCatEntity(catIdHex);
    let catName = event.params.catName.toString();
    let owner = OwnerEntity.load(cat.owner);
    log.debug('naming cat {} as "{}"', [catIdHex, catName]);
    cat.name = catName;
    cat.namedBlock = event.block.number.toI32();
    cat.namedTimestamp = event.block.timestamp.toI32();
    cat.namer = owner.id;
    cat.save();
}

export function handleCatAdoptedEvent(event: CatAdoptedEvent): void {
    let oldOwner = getOrCreateOwnerEntity(event.params.from);
    oldOwner.catCount = (oldOwner.catCount - 1) as i32;
    oldOwner.save();

    let newOwner = getOrCreateOwnerEntity(event.params.to);
    newOwner.catCount = (newOwner.catCount + 1) as i32;
    newOwner.save();

    let catIdHex = event.params.catId.toHex();
    log.debug('adopting cat {} for price {}', [catIdHex, event.params.price.toString()]);
    let cat = getCatEntity(catIdHex);
    cat.askPrice = ZERO;
    cat.bidPrice = ZERO;
    cat.ask = null;
    if (event.params.price.gt(cat.maxAdoptionPrice)) {
        cat.maxAdoptionPrice = event.params.price;
    }
    cat.owner = newOwner.id;
    // clear current bid if new owner is the bidder.
    if (cat.bid) {
        let bid = BidEntity.load(cat.bid!);
        let bidder = BidderEntity.load(bid!.bidder);
        if (bidder!.id == newOwner.id) {
            cat.bid = null;
        }
    }
    cat.save();

    let adoption = new AdoptionEntity(createCatEventEntityId(catIdHex, event));
    adoption.block = event.block.number.toI32();
    adoption.time = event.block.timestamp.toI32();
    adoption.cat = catIdHex;
    adoption.from = oldOwner.id;
    adoption.to = newOwner.id;
    adoption.price = event.params.price;
    adoption.isWrapping = event.params.to == WRAPPER_ADDRESS;
    adoption.save();
}

export function handleAdoptionOfferedEvent(event: CatAdoptionOfferedEvent): void {
    let catIdHex = event.params.catId.toHex();
    let askId =  createCatEventEntityId(catIdHex, event);
    let cat = getCatEntity(catIdHex);
    cat.askPrice = event.params.price;
    cat.ask = askId;
    cat.save();

    let ask = new AskEntity(askId);
    ask.block = event.block.number.toI32();
    ask.time = event.block.timestamp.toI32();
    ask.cat = cat.id;
    ask.owner = cat.owner;
    ask.receiver = event.params.toAddress as Bytes;
    ask.price = event.params.price;
    ask.save();
}

export function handleAdoptionOfferCancelledEvent(event: CatAdoptionOfferCancelledEvent): void {
    let catIdHex = event.params.catId.toHex();
    let cat = getCatEntity(catIdHex);
    cat.askPrice = ZERO;
    cat.ask = null;
    cat.save();

    // Create an empty ask.
    let ask = new AskEntity(createCatEventEntityId(catIdHex, event));
    ask.block = event.block.number.toI32();
    ask.time = event.block.timestamp.toI32();
    ask.cat = cat.id;
    ask.owner = cat.owner;
    ask.receiver = NULL_ADDRESS;
    ask.price = ZERO;
    ask.save();
}

export function handleAdoptionRequestedEvent(event: CatAdoptionRequestedEvent): void {
    let catIdHex = event.params.catId.toHex();
    let bidId = createCatEventEntityId(catIdHex, event);
    let cat = getCatEntity(catIdHex);
    cat.bidPrice = event.params.price;
    cat.bid = bidId;
    cat.save();

    let bidder = getOrCreateBidderEntity(event.params.from);
    bidder.save();

    let bid = new BidEntity(bidId);
    bid.block = event.block.number.toI32();
    bid.time = event.block.timestamp.toI32();
    bid.cat = cat.id;
    bid.bidder = bidder.id;
    bid.price = event.params.price;
    bid.save();
}

export function handleAdoptionRequestCancelledEvent(event: CatAdoptionRequestCancelledEvent): void {
    let catIdHex = event.params.catId.toHex();
    let cat = getCatEntity(catIdHex);
    if (!cat.bid) {
        log.error('No bid to cancel for cat {}', [catIdHex]);
        throw new Error('No bid to cancel');
    }
    let lastBid = BidEntity.load(cat.bid!);
    cat.bidPrice = ZERO;
    cat.bid = null;
    cat.save();

    // Create an empty bid.
    let bid = new BidEntity(createCatEventEntityId(catIdHex, event));
    bid.block = event.block.number.toI32();
    bid.time = event.block.timestamp.toI32();
    bid.cat = cat.id;
    bid.bidder = lastBid!.bidder;
    bid.price = ZERO;
    bid.save();
}

export function handleCatWrappedEvent(event: CatWrappedEvent): void {
    let catIdHex = event.params.catId.toHex();
    let cat = getCatEntity(catIdHex);
    if (cat.owner != WRAPPER_ADDRESS.toHex()) {
        log.error('Cat {} is not owned by wrapper', [catIdHex]);
        throw new Error('cat is not owned by wrapper');
    }
    cat.wrapperTokenId = event.params.tokenID;
    cat.save();
}

export function handleCatUnwrappedEvent(event: CatUnwrappedEvent): void {
    let catIdHex = event.params.catId.toHex();
    let cat = getCatEntity(catIdHex);
    if (cat.owner == WRAPPER_ADDRESS.toHex()) {
        log.error('Cat {} is still owned by wrapper', [catIdHex]);
        throw new Error('cat is still owned by wrapper');
    }
    cat.wrapperTokenId = null;
    cat.save();
}

function createCatEventEntityId(catIdHex: string, event: ethereum.Event): string {
    return catIdHex + '/' + event.transaction.hash.toHex() + '/' + event.logIndex.toString();
}

function getCatEntity(catId: string): CatEntity {
    let cat = CatEntity.load(catId);
    if (!cat) {
        log.error('Cat {} not found', [catId]);
        throw new Error('cat with id ' + catId + ' not found');
    }
    return cat!;
}

function getOrCreateOwnerEntity(addr: Address): OwnerEntity {
    let owner = OwnerEntity.load(addr.toHex());
    if (!owner) {
        owner = new OwnerEntity(addr.toHex());
        owner.catCount = 0;
        owner.isWrapper = addr == WRAPPER_ADDRESS;
    }
    return owner!;
}

function getOrCreateBidderEntity(addr: Address): BidderEntity {
    let bidder = BidderEntity.load(addr.toHex());
    if (!bidder) {
        bidder = new BidderEntity(addr.toHex());
    }
    return bidder!;
}

function getRescueIndex(): number {
    let e = RescueIndexEntity.load(RESCUE_INDEX_ID);
    if (!e) {
        return 0;
    }
    return e!.index as number;
}

function saveRescueIndex(idx: number): void {
    let e = new RescueIndexEntity(RESCUE_INDEX_ID);
    e.index = idx as i32;
    e.save();
}
