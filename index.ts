import * as ps from "child_process";
import * as fs from "fs-extra";
import * as path from "path";
import { encoding as defaultEncoding, failure, success } from "util.constants";
import { nil, sanitize } from "util.toolbox";

export interface CallOpts {
	async?: boolean;
	log?: any;
	shell?: string;
	shellArgs?: string[];
	cmd?: string;
	verbose?: boolean;
}

const reLinux = new RegExp("^linux");
const reMac = new RegExp("^darwin");
const reWin = new RegExp("^win");

/**
 * Performs an asynchronous command line call to run a given user command.
 * This method uses the node `execFile` call so that the method can control
 * the calling shell and parameters used to invoke it.  It will use BASH by
 * default for Linux/Mac, and when the environment is windows it will attempt
 * to use powershell.  The shell can be overriden with the opts argument.
 *
 * When using default BASH options it will invoke as a login shell.
 *
 * @param cmd {string} the command to execute on the command line
 * @param [opts] {CallOpts} optional arguments to the call
 *
 *     - `async: boolean`: if true, then the async version is called, otherwise
 *     the call will be synchronous.
 *     - `log: any`: the output logger that will be used with this call.  It
 *     uses a default of the console.log method.
 *     - `verbose: {boolean}`: if true, then output is printed
 *     - `shell: {string}`: the shell that will be invoked with this call.  It
 *     depends on the environment.
 *     - `shellArgs: {string[]}`: the parameters after shell, but before the
 *     given command.
 *
 * @param [cb] {Function} the callback function to execute when the command
 * finishes.
 */
export function call(
	cmd: string | Buffer | string[],
	opts: CallOpts = null,
	cb = nil
) {
	if (typeof opts === "function") {
		cb = opts;
		opts = null;
	}

	if (cmd == null) {
		return cb(new Error("No command given to execute in call"), failure);
	}

	if (cmd instanceof Buffer) {
		cmd = cmd.toString();
	} else if (cmd instanceof Array) {
		cmd = cmd.join(" ");
	}

	opts = Object.assign(
		{
			async: true,
			cmd,
			log: console.log,
			verbose: true,
			shell: isWin() ? "powershell" : "/bin/bash",
			shellArgs: isWin() ? ["", cmd] : ["-l", "-c", cmd]
		},
		opts
	);

	if (opts.verbose) {
		opts.log(`$ ${opts.shell} ${opts.shellArgs.join(" ")}`);
	}

	if (opts.async) {
		const out = ps.execFile(opts.shell, opts.shellArgs);

		out.stdout.on("data", (data: string | Buffer) => {
			sanitize(data, opts.verbose, opts.log);
			return out;
		});

		out.stderr.on("data", (data: string | Buffer) => {
			sanitize(data, opts.verbose, console.error);
		});

		out.on("close", (code: number) => {
			if (code !== success) {
				return cb(
					new Error(`Error executing command: ${cmd} (${code})`),
					code
				);
			}

			return cb(null, code);
		});
	} else {
		try {
			const out = ps.execFileSync(opts.shell, opts.shellArgs, {
				encoding: defaultEncoding
			});

			if (opts.verbose) {
				opts.log(out);
			}

			cb(null, success);
		} catch (err) {
			cb(err, failure);
		}
	}
}

/**
 * Performs an synchronous command line call to run a given user command.
 * This is a wrapper for the call function to wait for the command to
 * finish.  When the call is finished a callback is executed.
 *
 * @param cmd {string} the command to execute on the command line
 * @param [opts] {CallOpts} optional arguments to the call
 * @param [cb] {Function} the callback function to execute when the command
 * finishes.
 * @returns {number} returns 0 if the command was successful, otherwise 127.
 */
export function callSync(
	cmd: string | Buffer | string[],
	opts: CallOpts = null
): number {
	let rc: number = success;

	opts = Object.assign(
		{
			async: false,
			log: console.log
		},
		opts
	);

	call(cmd, { ...opts, async: false }, (err: any, code: number) => {
		if (err) {
			opts.log(err.message);
		}

		rc = code;
	});

	return rc;
}

/**
 * Retrieves a list of directories from the given input path.
 * @param src {string} the source directory to search for sub directories
 * @returns {Array} a list of directories.
 */
export function getDirectories(src: string): string[] {
	return fs
		.readdirSync(src)
		.filter((file: string) =>
			fs.statSync(path.join(src, file)).isDirectory()
		);
}

/**
 * Checks if the environment is Linux
 * @returns {boolean} true if the opsys is Linux, otherwise false
 */
export function isLinux(): boolean {
	return reLinux.test(process.platform);
}

/**
 * Checks if the environment is OSX
 * @returns {boolean} true if the opsys is OSX, otherwise false
 */
export function isMac(): boolean {
	return reMac.test(process.platform);
}

/**
 * Checks if the environment is windows
 * @returns {boolean} true if the opsys is windows, otherwise false
 */
export function isWin(): boolean {
	return reWin.test(process.platform);
}
