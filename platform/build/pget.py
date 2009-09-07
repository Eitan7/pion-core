#!/usr/bin/python
# ---------------------------------------------
# pion cookie authentication HTTP query wrapper
# ---------------------------------------------

import sys, httplib, optparse, re, xml.dom.minidom


# from http://code.activestate.com/recipes/576750/
pretty_print = lambda doc: '\n'.join([line for line in doc.toprettyxml(indent=' '*2).split('\n') if line.strip()])


def get_response(con, uristem, headers = {}):
	try:
		con.request('GET', uristem, None, headers)
	except:
		print 'error: unable to establish connection to Pion server'
		sys.exit(1)
	r = con.getresponse()
	if (r.status == 401):
		print 'error: Unable to authenticate to Pion server'
		sys.exit(1)
	if (r.status >= 400 and r.status <= 599):
		print 'error: response =', r.status, r.reason
		sys.exit(1)
	return r


def print_response(r):
	body = r.read()
	ctype = r.getheader('Content-Type');
	if (ctype.lower().startswith('text/xml')):
		doc = xml.dom.minidom.parseString(body)
		print pretty_print(doc)
		#print doc.toprettyxml()	
	else:
		print body


def get_cookie(con, user, password):
	r = get_response(con, '/login?user=' + user + '&pass=' + password)
	r.read()	# needed to reset the connection for the next request
	if (r.status != 204):
		print 'error: Bad response for Pion server login request (', r.status, ')'
		sys.exit(1)
	cookie_rx = re.compile(r'.*pion_session_id="([^"]+)".*')
	cookie_match = cookie_rx.match(r.getheader('Set-Cookie'))
	if (not cookie_match or cookie_match.lastindex != 1):
		print 'error: Unable to retrieve session cookie from Pion server'
		sys.exit(1)
	return cookie_match.group(1)


def get_con(options):
	# establish connection to Pion server
	if (options.ssl):
		con = httplib.HTTPSConnection(options.server, options.port);
	else:
		con = httplib.HTTPConnection(options.server, options.port);
	# get session cookie
	options.cookie = get_cookie(con, options.user, options.password)
	return con


def get_arg_parser():
	# prepare argument parser
	parser = optparse.OptionParser()
	parser.add_option("-u", "--user", action="store", default="pion",
		help="name of user to authenticate as")
	parser.add_option("-p", "--password", action="store", default="pion",
		help="password of user to authenticate as")
	parser.add_option("-s", "--server", action="store", default="localhost",
		help="hostname or IP address of the Pion server")
	parser.add_option("", "--port", action="store", default=8888, type="int",
		help="port number on the Pion server to connect to")
	parser.add_option("", "--ssl", action="store_true", default=False,
		help="use SSL encryption for the Pion server connection")
	return parser


def parse_args():
	# prepare argument parser
	parser = get_arg_parser()
	parser.add_option("-r", "--reactor", action="store",
		help="identifier of reactor to perform an action upon")
	parser.add_option("", "--stats", action="store_true", default=False,
		help="retrieves statistics for one or all Pion reactors")
	parser.add_option("", "--start", action="store_true", default=False,
		help="starts a reactor if it is not already running")
	parser.add_option("", "--stop", action="store_true", default=False,
		help="stops a reactor if it is running")
	parser.add_option("", "--query", action="store",
		help="calls a reactor's query service")
	# parse command-line arguments
	options, arguments = parser.parse_args()		
	# check validity of arguments
	if (options.reactor):
		if (options.start):
			uristem = '/config/reactors/' + options.reactor + '/start'
		elif (options.stop):
			uristem = '/config/reactors/' + options.reactor + '/stop'
		elif (options.stats):
			uristem = '/query/reactors/' + options.reactor
		elif (options.query):
			if (options.query[0] != '/'):
				options.query = '/' + options.query
			uristem = '/query/reactors/' + options.reactor + options.query
		else:
			uristem = '/config/reactors/' + options.reactor
	elif (options.start or options.stop or options.query):
		print 'error: missing required --reactor argument'
		sys.exit(1)
	elif (options.stats):
		uristem = '/query/reactors'
	else:
		if (len(arguments) != 1):
			print 'error: No uri-stem argument was specified'
			sys.exit(1)
		uristem = arguments[0]
	# return argument data
	return options, uristem


def main():
	# parse command-line options
	options, uristem = parse_args()
	# establish connection to Pion server
	con = get_con(options)
	# retrieve and display resource from Pion server
	r = get_response(con, uristem, {'Cookie' : 'pion_session_id="' + options.cookie + '"'})
	print_response(r)
	# close the HTTP connection
	con.close()


# call main() if script is being executed	
if __name__ == '__main__':
	main()
