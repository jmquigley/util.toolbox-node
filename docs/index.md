## Functions

<dl>
<dt><a href="#call">call(cmd, [opts], [cb])</a></dt>
<dd><p>Performs an asynchronous command line call to run a given user command.
This method uses the node <code>execFile</code> call so that the method can control
the calling shell and parameters used to invoke it.  It will use BASH by
default for Linux/Mac, and when the environment is windows it will attempt
to use powershell.  The shell can be overriden with the opts argument.</p>
<p>When using default BASH options it will invoke as a login shell.</p>
</dd>
<dt><a href="#callSync">callSync(cmd, [opts], [cb])</a> ⇒ <code>number</code></dt>
<dd><p>Performs an synchronous command line call to run a given user command.
This is a wrapper for the call function to wait for the command to
finish.  When the call is finished a callback is executed.</p>
</dd>
<dt><a href="#getDirectories">getDirectories(src)</a> ⇒ <code>Array</code></dt>
<dd><p>Retrieves a list of directories from the given input path.</p>
</dd>
</dl>

<a name="call"></a>

## call(cmd, [opts], [cb])
Performs an asynchronous command line call to run a given user command.
This method uses the node `execFile` call so that the method can control
the calling shell and parameters used to invoke it.  It will use BASH by
default for Linux/Mac, and when the environment is windows it will attempt
to use powershell.  The shell can be overriden with the opts argument.

When using default BASH options it will invoke as a login shell.

**Kind**: global function  
**Params**

- cmd <code>string</code> - the command to execute on the command line
- [opts] <code>CallOpts</code> <code> = </code> - optional arguments to the call

    - `async: boolean`: if true, then the async version is called, otherwise
    the call will be synchronous.
    - `log: any`: the output logger that will be used with this call.  It
    uses a default of the console.log method.
    - `verbose: {boolean}`: if true, then output is printed
    - `shell: {string}`: the shell that will be invoked with this call.  It
    depends on the environment.
    - `shellArgs: {string[]}`: the parameters after shell, but before the
    given command.
- [cb] <code>function</code> - the callback function to execute when the command
finishes.

<a name="callSync"></a>

## callSync(cmd, [opts], [cb]) ⇒ <code>number</code>
Performs an synchronous command line call to run a given user command.
This is a wrapper for the call function to wait for the command to
finish.  When the call is finished a callback is executed.

**Kind**: global function  
**Returns**: <code>number</code> - returns 0 if the command was successful, otherwise 127.  
**Params**

- cmd <code>string</code> - the command to execute on the command line
- [opts] <code>CallOpts</code> <code> = </code> - optional arguments to the call
- [cb] <code>function</code> - the callback function to execute when the command
finishes.

<a name="getDirectories"></a>

## getDirectories(src) ⇒ <code>Array</code>
Retrieves a list of directories from the given input path.

**Kind**: global function  
**Returns**: <code>Array</code> - a list of directories.  
**Params**

- src <code>string</code> - the source directory to search for sub directories

