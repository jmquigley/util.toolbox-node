"use strict";

console.log = jest.fn();

const debug = require("debug")("util.toolbox.test");

import * as path from "path";
import uuid from "uuid";
import {regexUUID} from "util.constants";
import {
	closestNumber,
	failure,
	getRandomInt,
	getRandomIntInclusive,
	getUUID,
	isDarwin,
	isLinux,
	isWin,
	nil,
	nilEvent,
	sanitize,
	success
} from "util.toolbox";
import {call, callSync, getDirectories} from "../index";

test("Test of the call async function", (done) => {
	let cmd = "";
	if (isWin) {
		cmd = "Get-ChildItem Env:";
	} else if (isDarwin || isLinux) {
		cmd = "env";
	}

	call(cmd, (err: Error, code: number) => {
		if (err) {
			throw new Error(err.message);
		}

		expect(code).toBe(0);
		done();
	});
});

test("Test of the call async function with bad command", (done) => {
	call(uuid.v4(), (err: Error, code: number) => {
		if (err) {
			expect(`${err.message} (${code})`).toBeTruthy();
			expect(code).not.toBe(0);
			return done();
		}

		throw new Error("Should not get here");
	});
});

test("Test of the call async function with long output", (done) => {
	let cmd = "";
	if (isWin) {
		cmd = "dir";
	} else if (isDarwin || isLinux) {
		cmd = "ls -axpl";
	}

	call(cmd, (err: Error, code: number) => {
		if (err) {
			throw new Error(err.message);
		}

		expect(code).toBe(0);
		done();
	});
});

test("Test of the call async function with Buffer", (done) => {
	let cmd: Buffer = null;
	if (isWin) {
		cmd = new Buffer.from("dir");
	} else if (isDarwin || isLinux) {
		cmd = new Buffer.from("ls -axpl");
	}

	call(cmd, (err: Error, code: number) => {
		if (err) {
			throw new Error(err.message);
		}

		expect(code).toBe(0);
		done();
	});
});

test("Test of the call async function with Array of command parts", (done) => {
	let cmd: string[] = [];
	if (isWin) {
		cmd = ["dir", "-Directory"];
	} else if (isDarwin || isLinux) {
		cmd = ["ls", "-axpl"];
	}

	call(cmd, (err: Error, code: number) => {
		if (err) {
			throw new Error(err.message);
		}

		expect(code).toBe(0);
		done();
	});
});

test("Test of the call async function with null command", (done) => {
	call(null, (err: Error, code: number) => {
		if (err) {
			expect(code).toBe(127);
			expect(err.message).toBe("No command given to execute in call");
			return done();
		}

		throw new Error("Should not get here");
	});
});

test("Test of synchronous call function", () => {
	let cmd = "";
	if (isWin) {
		cmd = 'echo "powershell call"';
	} else if (isDarwin || isLinux) {
		cmd = "sleep 2";
	}

	const rc = callSync(cmd);
	expect(rc).toBe(success);
});

test("Test of synchronous call function with a bad command", () => {
	const rc = callSync(uuid.v4());
	expect(rc).toBe(failure);
});

test("Test retrieval of directories", () => {
	const fixtureDir = path.join(process.cwd(), "__tests__", "fixtures");
	const dirs = getDirectories(fixtureDir);

	expect(dirs).toBeTruthy();
	expect(dirs.length).toBe(3);
	expect(dirs).toEqual(["dir1", "dir2", "dir3"]);
});

test("Test retrieval from a path with no directories within it (negative test)", () => {
	const fixtureDir = path.join(
		process.cwd(),
		"__tests__",
		"fixtures",
		"dir1"
	);
	const dirs = getDirectories(fixtureDir);

	expect(dirs).toBeTruthy();
	expect(dirs.length).toBe(0);
});
