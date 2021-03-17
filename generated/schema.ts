// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Cat extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Cat entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Cat entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Cat", id.toString(), this);
  }

  static load(id: string): Cat | null {
    return store.get("Cat", id) as Cat | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get catId(): string {
    let value = this.get("catId");
    return value.toString();
  }

  set catId(value: string) {
    this.set("catId", Value.fromString(value));
  }

  get isGenesis(): boolean {
    let value = this.get("isGenesis");
    return value.toBoolean();
  }

  set isGenesis(value: boolean) {
    this.set("isGenesis", Value.fromBoolean(value));
  }

  get rescueTime(): i32 {
    let value = this.get("rescueTime");
    return value.toI32();
  }

  set rescueTime(value: i32) {
    this.set("rescueTime", Value.fromI32(value));
  }

  get rescueBlock(): i32 {
    let value = this.get("rescueBlock");
    return value.toI32();
  }

  set rescueBlock(value: i32) {
    this.set("rescueBlock", Value.fromI32(value));
  }

  get rescueIndex(): i32 {
    let value = this.get("rescueIndex");
    return value.toI32();
  }

  set rescueIndex(value: i32) {
    this.set("rescueIndex", Value.fromI32(value));
  }

  get rescuer(): string {
    let value = this.get("rescuer");
    return value.toString();
  }

  set rescuer(value: string) {
    this.set("rescuer", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (value === null) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(value as string));
    }
  }

  get namedBlock(): i32 {
    let value = this.get("namedBlock");
    return value.toI32();
  }

  set namedBlock(value: i32) {
    this.set("namedBlock", Value.fromI32(value));
  }

  get namedTimestamp(): i32 {
    let value = this.get("namedTimestamp");
    return value.toI32();
  }

  set namedTimestamp(value: i32) {
    this.set("namedTimestamp", Value.fromI32(value));
  }

  get namer(): string | null {
    let value = this.get("namer");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set namer(value: string | null) {
    if (value === null) {
      this.unset("namer");
    } else {
      this.set("namer", Value.fromString(value as string));
    }
  }

  get wrapperTokenId(): BigInt | null {
    let value = this.get("wrapperTokenId");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set wrapperTokenId(value: BigInt | null) {
    if (value === null) {
      this.unset("wrapperTokenId");
    } else {
      this.set("wrapperTokenId", Value.fromBigInt(value as BigInt));
    }
  }

  get owner(): string {
    let value = this.get("owner");
    return value.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get maxAdoptionPrice(): BigInt {
    let value = this.get("maxAdoptionPrice");
    return value.toBigInt();
  }

  set maxAdoptionPrice(value: BigInt) {
    this.set("maxAdoptionPrice", Value.fromBigInt(value));
  }

  get adoptionHistory(): Array<string> {
    let value = this.get("adoptionHistory");
    return value.toStringArray();
  }

  set adoptionHistory(value: Array<string>) {
    this.set("adoptionHistory", Value.fromStringArray(value));
  }

  get askPrice(): BigInt | null {
    let value = this.get("askPrice");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set askPrice(value: BigInt | null) {
    if (value === null) {
      this.unset("askPrice");
    } else {
      this.set("askPrice", Value.fromBigInt(value as BigInt));
    }
  }

  get ask(): string | null {
    let value = this.get("ask");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set ask(value: string | null) {
    if (value === null) {
      this.unset("ask");
    } else {
      this.set("ask", Value.fromString(value as string));
    }
  }

  get askHistory(): Array<string> {
    let value = this.get("askHistory");
    return value.toStringArray();
  }

  set askHistory(value: Array<string>) {
    this.set("askHistory", Value.fromStringArray(value));
  }

  get bidPrice(): BigInt | null {
    let value = this.get("bidPrice");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set bidPrice(value: BigInt | null) {
    if (value === null) {
      this.unset("bidPrice");
    } else {
      this.set("bidPrice", Value.fromBigInt(value as BigInt));
    }
  }

  get bid(): string | null {
    let value = this.get("bid");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set bid(value: string | null) {
    if (value === null) {
      this.unset("bid");
    } else {
      this.set("bid", Value.fromString(value as string));
    }
  }

  get bidHistory(): Array<string> {
    let value = this.get("bidHistory");
    return value.toStringArray();
  }

  set bidHistory(value: Array<string>) {
    this.set("bidHistory", Value.fromStringArray(value));
  }
}

export class Ask extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Ask entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Ask entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Ask", id.toString(), this);
  }

  static load(id: string): Ask | null {
    return store.get("Ask", id) as Ask | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get block(): i32 {
    let value = this.get("block");
    return value.toI32();
  }

  set block(value: i32) {
    this.set("block", Value.fromI32(value));
  }

  get time(): i32 {
    let value = this.get("time");
    return value.toI32();
  }

  set time(value: i32) {
    this.set("time", Value.fromI32(value));
  }

  get cat(): string {
    let value = this.get("cat");
    return value.toString();
  }

  set cat(value: string) {
    this.set("cat", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get receiver(): Bytes | null {
    let value = this.get("receiver");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set receiver(value: Bytes | null) {
    if (value === null) {
      this.unset("receiver");
    } else {
      this.set("receiver", Value.fromBytes(value as Bytes));
    }
  }

  get price(): BigInt {
    let value = this.get("price");
    return value.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }
}

export class Bid extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Bid entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Bid entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Bid", id.toString(), this);
  }

  static load(id: string): Bid | null {
    return store.get("Bid", id) as Bid | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get block(): i32 {
    let value = this.get("block");
    return value.toI32();
  }

  set block(value: i32) {
    this.set("block", Value.fromI32(value));
  }

  get time(): i32 {
    let value = this.get("time");
    return value.toI32();
  }

  set time(value: i32) {
    this.set("time", Value.fromI32(value));
  }

  get cat(): string {
    let value = this.get("cat");
    return value.toString();
  }

  set cat(value: string) {
    this.set("cat", Value.fromString(value));
  }

  get bidder(): string {
    let value = this.get("bidder");
    return value.toString();
  }

  set bidder(value: string) {
    this.set("bidder", Value.fromString(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    return value.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }
}

export class Adoption extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Adoption entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Adoption entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Adoption", id.toString(), this);
  }

  static load(id: string): Adoption | null {
    return store.get("Adoption", id) as Adoption | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get block(): i32 {
    let value = this.get("block");
    return value.toI32();
  }

  set block(value: i32) {
    this.set("block", Value.fromI32(value));
  }

  get time(): i32 {
    let value = this.get("time");
    return value.toI32();
  }

  set time(value: i32) {
    this.set("time", Value.fromI32(value));
  }

  get cat(): string {
    let value = this.get("cat");
    return value.toString();
  }

  set cat(value: string) {
    this.set("cat", Value.fromString(value));
  }

  get from(): string {
    let value = this.get("from");
    return value.toString();
  }

  set from(value: string) {
    this.set("from", Value.fromString(value));
  }

  get to(): string {
    let value = this.get("to");
    return value.toString();
  }

  set to(value: string) {
    this.set("to", Value.fromString(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    return value.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get isWrapping(): boolean {
    let value = this.get("isWrapping");
    return value.toBoolean();
  }

  set isWrapping(value: boolean) {
    this.set("isWrapping", Value.fromBoolean(value));
  }
}

export class Owner extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Owner entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Owner entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Owner", id.toString(), this);
  }

  static load(id: string): Owner | null {
    return store.get("Owner", id) as Owner | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get catCount(): i32 {
    let value = this.get("catCount");
    return value.toI32();
  }

  set catCount(value: i32) {
    this.set("catCount", Value.fromI32(value));
  }

  get isWrapper(): boolean {
    let value = this.get("isWrapper");
    return value.toBoolean();
  }

  set isWrapper(value: boolean) {
    this.set("isWrapper", Value.fromBoolean(value));
  }

  get cats(): Array<string> {
    let value = this.get("cats");
    return value.toStringArray();
  }

  set cats(value: Array<string>) {
    this.set("cats", Value.fromStringArray(value));
  }

  get asks(): Array<string> {
    let value = this.get("asks");
    return value.toStringArray();
  }

  set asks(value: Array<string>) {
    this.set("asks", Value.fromStringArray(value));
  }
}

export class Bidder extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Bidder entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Bidder entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Bidder", id.toString(), this);
  }

  static load(id: string): Bidder | null {
    return store.get("Bidder", id) as Bidder | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get bids(): Array<string> {
    let value = this.get("bids");
    return value.toStringArray();
  }

  set bids(value: Array<string>) {
    this.set("bids", Value.fromStringArray(value));
  }
}

export class RescueIndex extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save RescueIndex entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save RescueIndex entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("RescueIndex", id.toString(), this);
  }

  static load(id: string): RescueIndex | null {
    return store.get("RescueIndex", id) as RescueIndex | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get index(): i32 {
    let value = this.get("index");
    return value.toI32();
  }

  set index(value: i32) {
    this.set("index", Value.fromI32(value));
  }
}
