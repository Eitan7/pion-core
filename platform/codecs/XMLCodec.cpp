// ------------------------------------------------------------------------
// Pion is a development platform for building Reactors that process Events
// ------------------------------------------------------------------------
// Copyright (C) 2007-2008 Atomic Labs, Inc.  (http://www.atomiclabs.com)
//
// Pion is free software: you can redistribute it and/or modify it under the
// terms of the GNU Affero General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
//
// Pion is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for
// more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Pion.  If not, see <http://www.gnu.org/licenses/>.
//

#include "XMLCodec.hpp"


namespace pion {		// begin namespace pion
namespace platform {	// begin namespace platform (Pion Platform Library)


// static members of XMLCodec
const std::string			XMLCodec::CONTENT_TYPE = "text/xml";


// XMLCodec member functions

CodecPtr XMLCodec::clone(void) const
{
	XMLCodec *new_codec(new XMLCodec());
	return CodecPtr(new_codec);
}

void XMLCodec::write(std::ostream& out, const Event& e)
{
}

bool XMLCodec::read(std::istream& in, Event& e)
{
	return false;
}

EventPtr XMLCodec::read(std::istream& in)
{
	return EventPtr();
}

void XMLCodec::updateVocabulary(const Vocabulary& v)
{
}
	
	
}	// end namespace platform
}	// end namespace pion


/// creates new XMLCodec objects
extern "C" PION_PLUGIN_API pion::platform::Codec *pion_create_XMLCodec(void) {
	return new pion::platform::XMLCodec();
}

/// destroys XMLCodec objects
extern "C" PION_PLUGIN_API void pion_destroy_XMLCodec(pion::platform::XMLCodec *codec_ptr) {
	delete codec_ptr;
}
