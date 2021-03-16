import { Address, BigInt, Bytes, ethereum, store } from '@graphprotocol/graph-ts';
import {
    MoonCatRescue,
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
    let owner = getOrCreateOwnerEntity(NULL_ADDRESS);
    owner.save();

    let rescueIndex = RescueIndexEntity.load(RESCUE_INDEX_ID);
    let catIds = event.params.catIds;
    for (let i = 0; i < catIds.length; ++i, ++rescueIndex.index) {
        let catIdHex = catIds[i].toHex();
        let cat = new CatEntity(catIdHex);
        cat.rescueTime = event.block.timestamp.toI32();
        cat.rescueBlock = event.block.number.toI32();
        cat.rescueIndex = rescueIndex!.index;
        cat.owner = owner.id;
        cat.save();
        cat.isGenesis = true;
    }
    rescueIndex.save();
}
export function handleCatRescuedEvent(event: CatRescuedEvent): void {
    let catIdHex = event.params.catId.toHex();

    let owner = getOrCreateOwnerEntity(event.params.to);
    owner.save();

    let rescueIndex = RescueIndexEntity.load(RESCUE_INDEX_ID);
    let cat = new CatEntity(catIdHex);
    cat.isGenesis = false;
    cat.rescueTime = event.block.timestamp.toI32();
    cat.rescueBlock = event.block.number.toI32();
    cat.rescueIndex = rescueIndex!.index++;
    cat.owner = owner.id;
    cat.save();
    rescueIndex.save();
}

export function handleCatNamedEvent(event: CatNamedEvent): void {
    let catIdHex = event.params.catId.toHex();
    let cat = getCatEntity(catIdHex);
    cat.name = event.params.catName.toString();
    cat.namedBlock = event.block.number.toI32();
    cat.namedTimestamp = event.block.timestamp.toI32();
    cat.namedOwner = event.transaction.from.toHex(); // not really
}

export function handleCatAdoptedEvent(event: CatAdoptedEvent): void {
    let newOwner = getOrCreateOwnerEntity(event.params.to);
    newOwner.save();
    let catIdHex = event.params.catId.toHex();
    let cat = getCatEntity(catIdHex);
    let oldOwnerId = cat.owner;
    if (cat.askPrice) {
        if (cat.askPrice! != event.params.price) {
            throw new Error('cat ask price does not match adoption price');
        }
    }
    if (cat.bidPrice) {
        if (cat.bidPrice! != event.params.price) {
            throw new Error('cat bid price does not match adoption price');
        }
    }
    cat.askPrice = ZERO;
    cat.bidPrice = ZERO;
    cat.ask = null;
    cat.bid = null;
    cat.lastAdoptionPrice = event.params.price;
    cat.lastAdoptionBlock = event.block.number.toI32();
    cat.lastAdoptionTime = event.block.timestamp.toI32();
    cat.owner = newOwner.id;
    cat.save();

    let adoption = new AdoptionEntity(createCatEventEntityId(catIdHex, event));
    adoption.block = event.block.number.toI32();
    adoption.time = event.block.timestamp.toI32();
    adoption.cat = catIdHex;
    adoption.from = oldOwnerId;
    adoption.to = newOwner.id;
    adoption.price = event.params.price;
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
        throw new Error('cat is not owned by wrapper');
    }
    cat.wrapperTokenId = event.params.tokenID;
    cat.save();
}

export function handleCatUnwrappedEvent(event: CatUnwrappedEvent): void {
    let catIdHex = event.params.catId.toHex();
    let cat = getCatEntity(catIdHex);
    if (cat.owner == WRAPPER_ADDRESS.toHex()) {
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
        throw new Error('cat with id ' + catId + ' not found');
    }
    return cat!;
}

function getOrCreateOwnerEntity(addr: Address): OwnerEntity {
    let owner = OwnerEntity.load(addr.toHex());
    if (!owner) {
        owner = new OwnerEntity(addr.toHex());
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
