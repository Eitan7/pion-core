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

#ifndef __PION_TRANSFORM_HEADER__
#define __PION_TRANSFORM_HEADER__

#include <boost/regex.hpp>
#include <boost/algorithm/string/compare.hpp>
#include <boost/algorithm/string/predicate.hpp>
#include <pion/PionConfig.hpp>
#include <pion/PionException.hpp>
#include <pion/platform/Vocabulary.hpp>
#include <pion/platform/Event.hpp>
#include <pion/platform/Comparison.hpp>
#include <pion/PionLogger.hpp>
#include <pion/platform/ConfigManager.hpp>

namespace pion {		// begin namespace pion
namespace platform {	// begin namespace platform (Pion Platform Library)

class PION_PLATFORM_API Transform
{
public:
	/// identifies the Vocabulary Term that is being tested (for regex)
	Vocabulary::Term			m_term;

	/// a copy to Vocabulary pointer, for parsing TransformXXX entries
	const Vocabulary&			m_v;

	/// invalid/missing type of transformation
	class MissingTransformField : public PionException {
	public:
		MissingTransformField(const std::string& str)
			: PionException("Invalid type of transformation: ", str) {}
	};

	/// exception thrown if regex_replace fails and throws
	class RegexFailure : public PionException {
	public:
		RegexFailure(const std::string& what)
			: PionException("Transformation failed: ", what) {}
	};

//	mutable PionLogger			m_logger;

	/// virtual destructor: you may extend this class
	virtual ~Transform() {}

	/**
	 * constructs a new Transform rule
	 *
	 * @param term the term that will be examined
	 * @param set_term the term that will be set (if not InPlace)
	 */
	Transform(const Vocabulary& v, const Vocabulary::Term& term)
		: 	m_term(term), m_v(v) //, m_logger(PION_GET_LOGGER("pion.Transform"))
	{
	}

   /**
	* updateVocabulary Updates all Transform classes to use new vocabulary value
	*
	* @param v New vocabulary object, updates only m_term for each class
	*/
	void updateVocabulary(const Vocabulary& v)
	{
		// assume that Term references never change
		m_term = v[m_term.term_ref];
	}

   /**
	* removeTerm removes m_term.term_ref value(s) from event
	*
	* @param e EventPtr pointing to event, where value will be removed from
	*/
	inline void removeTerm(EventPtr& e)
	{
		e->clear(m_term.term_ref);
	}

	/**
	 * transforms event terms
	 *
	 * @param e the Event to transform
	 *
	 * @return true if the Transformation occured; false if it did not
	 */
	virtual bool transform(EventPtr& d, const EventPtr& s) = 0;

	/// Definitions for static ELEMENT NAMEs
	static const std::string			LOOKUP_TERM_NAME;
	static const std::string			TERM_ELEMENT_NAME;
	static const std::string			LOOKUP_MATCH_ELEMENT_NAME;
	static const std::string			LOOKUP_FORMAT_ELEMENT_NAME;
	static const std::string			LOOKUP_DEFAULT_ELEMENT_NAME;
	static const std::string			VALUE_ELEMENT_NAME;
	static const std::string			RULES_STOP_ON_FIRST_ELEMENT_NAME;
	static const std::string			RULE_ELEMENT_NAME;
	static const std::string			TYPE_ELEMENT_NAME;
	static const std::string			TRANSFORMATION_SET_VALUE_NAME;
	static const std::string			LOOKUP_DEFAULTACTION_ELEMENT_NAME;
	static const std::string			LOOKUP_LOOKUP_ELEMENT_NAME;
	static const std::string			LOOKUP_KEY_ATTRIBUTE_NAME;
	static const std::string			SOURCE_TERM_ELEMENT_NAME;
	static const std::string			REGEXP_ELEMENT_NAME;
	static const std::string			REGEXP_ATTRIBUTE_NAME;
};

	/**
	 * AssignValue Assigns "value" into "term" of "e" -- does the appropriate casts to make it fit
	 *
	 * @param e the Event to assign the term/value into
	 * @param term the term (type) to use for assignment
	 * @param value the value (as a string) to assign, using appropriate cast
	 *
	 * @return true if the assignment was possible/done
	 */
inline bool AssignValue(EventPtr& e, const Vocabulary::Term& term, const std::string& value)
{
	if (value.empty())		// New shortcut -- if empty value, don't assign
	  return true;

	switch (term.term_type) {
		case Vocabulary::TYPE_NULL:
		case Vocabulary::TYPE_OBJECT:
			return false;				// No assignment -- not assignable type...
			break;
		case Vocabulary::TYPE_INT8:
		case Vocabulary::TYPE_INT16:
		case Vocabulary::TYPE_INT32:
			e->setInt(term.term_ref, boost::lexical_cast<boost::int32_t>(value));
			break;
		case Vocabulary::TYPE_INT64:
			e->setBigInt(term.term_ref, boost::lexical_cast<boost::int64_t>(value));
			break;
		case Vocabulary::TYPE_UINT8:
		case Vocabulary::TYPE_UINT16:
		case Vocabulary::TYPE_UINT32:
			e->setUInt(term.term_ref, boost::lexical_cast<boost::uint32_t>(value));
			break;
		case Vocabulary::TYPE_UINT64:
			e->setUBigInt(term.term_ref, boost::lexical_cast<boost::uint64_t>(value));
			break;
		case Vocabulary::TYPE_FLOAT:
			e->setFloat(term.term_ref, boost::lexical_cast<float>(value));
			break;
		case Vocabulary::TYPE_DOUBLE:
			e->setDouble(term.term_ref, boost::lexical_cast<double>(value));
			break;
		case Vocabulary::TYPE_LONG_DOUBLE:
			e->setLongDouble(term.term_ref, boost::lexical_cast<long double>(value));
			break;
		case Vocabulary::TYPE_SHORT_STRING:
		case Vocabulary::TYPE_STRING:
		case Vocabulary::TYPE_LONG_STRING:
		case Vocabulary::TYPE_CHAR:
		case Vocabulary::TYPE_BLOB:
		case Vocabulary::TYPE_ZBLOB:
			e->setString(term.term_ref, value);
			break;
		case Vocabulary::TYPE_DATE_TIME:
		case Vocabulary::TYPE_DATE:
		case Vocabulary::TYPE_TIME:
			{
				pion::PionTimeFacet f(term.term_format);
				const pion::PionDateTime pdt(f.fromString(value));
				e->setDateTime(term.term_ref, pdt);
//				e->setDateTime(term.term_ref, boost::lexical_cast<PionDateTime>(value));
			}
			break;
	}
	return true;
}

	/**
	 * getStringValue obtains a string value from event, using iterator ec, with term term
	 *
	 * @param s the string to retrieve the value into
	 * @param term the term (for type identification) on how to treat/cast the value
	 * @param ec Event::ConstIterator, to point to the specific value (one term may have multiple values)
	 *
	 * @return std::string returns s
	 */
inline std::string& getStringValue(std::string& s, const Vocabulary::Term& term, const Event::ConstIterator ec)
{
	std::ostringstream ss;
	switch (term.term_type) {
		case Vocabulary::TYPE_NULL:
		case Vocabulary::TYPE_OBJECT:
			// not serializable
			ss.clear();
			break;
		case Vocabulary::TYPE_INT8:
		case Vocabulary::TYPE_INT16:
		case Vocabulary::TYPE_INT32:
			ss << boost::get<const boost::int32_t&>(ec->value);
			break;
		case Vocabulary::TYPE_UINT8:
		case Vocabulary::TYPE_UINT16:
		case Vocabulary::TYPE_UINT32:
			ss << boost::get<const boost::uint32_t&>(ec->value);
			break;
		case Vocabulary::TYPE_INT64:
			ss << boost::get<const boost::int64_t&>(ec->value);
			break;
		case Vocabulary::TYPE_UINT64:
			ss << boost::get<const boost::uint64_t&>(ec->value);
			break;
		case Vocabulary::TYPE_FLOAT:
			ss << boost::get<const float&>(ec->value);
			break;
		case Vocabulary::TYPE_DOUBLE:
			ss << boost::get<const double&>(ec->value);
			break;
		case Vocabulary::TYPE_LONG_DOUBLE:
			ss << boost::get<const long double&>(ec->value);
			break;
		case Vocabulary::TYPE_DATE_TIME:
		case Vocabulary::TYPE_DATE:
		case Vocabulary::TYPE_TIME:
			{
				pion::PionTimeFacet f(term.term_format);
				ss << f.toString(boost::get<const PionDateTime&>(ec->value));
				break;
			}
		case Vocabulary::TYPE_SHORT_STRING:
		case Vocabulary::TYPE_STRING:
		case Vocabulary::TYPE_LONG_STRING:
		case Vocabulary::TYPE_CHAR:
		case Vocabulary::TYPE_BLOB:
		case Vocabulary::TYPE_ZBLOB:
			ss << boost::get<const Event::BlobType&>(ec->value).get();
			break;
	}
	s = ss.str();
	return s;
}

/// TransformAssignValue -- Transformation based on assigning a value to a Term
/// Current implementation takes the std::string value of the "SetValue", and does
/// a lexical cast upon assignment -- theoretically an implementation that did a lexical
/// cast to start with, and then used an assignment might be faster... (once vs. many times)
/// Also, this implementation will throw a every assignment (if not possible to lexically cast)
/// while, a pre-cast version would throw once -- at configuration time...
class PION_PLATFORM_API TransformAssignValue
	: public Transform
{
	/// The value to set the target event/term to
	std::string					m_tr_set_value;

public:

	/**
	 * TransformAssignValue constructs a transformation assignment based on Value
	 *
	 * @param v Vocabulary to use
	 * @param term The source term type to use
	 * @param config_ptr Pointer to XML configuration of the AssignValue entity
	 */
	TransformAssignValue(const Vocabulary& v, const Vocabulary::Term& term, const xmlNodePtr config_ptr)
		: Transform(v, term)
	{
		// <Value>escape(value)</Value>
		std::string val;
		if (! ConfigManager::getConfigOptionEmptyOk(VALUE_ELEMENT_NAME, val, config_ptr))
			throw MissingTransformField("Missing Value in TransformationAssignValue");
		m_tr_set_value = val;
	}

	/**
	 * transform Assigns a fixed value to event/term
	 *
	 * @param d Destination event (pointer) to modify term
	 * @param s Source event (dummy), passed in only for conformity
	 *
	 * @return true if the Transformation occured; false if it did not
	 */
	virtual bool transform(EventPtr& d, const EventPtr& s)
	{
		return AssignValue(d, m_term, m_tr_set_value);
	}
};


/// TransformAssignTerm -- Transformation based on copying Terms from the source event
/// Should the type be re-cast, if non-matching?
class PION_PLATFORM_API TransformAssignTerm
	: public Transform
{
	/// identifies the Vocabulary Term that is being copied from
	Vocabulary::TermRef			m_src_term_ref;

public:

	/**
	 * TransformAssignTerm constructs a transformation assignment based on a source term
	 *
	 * @param v Vocabulary to use
	 * @param term The source term type to use
	 * @param config_ptr Pointer to XML configuration of the AssignTerm entity
	 */
	TransformAssignTerm(const Vocabulary& v, const Vocabulary::Term& term, const xmlNodePtr config_ptr)
		: Transform(v, term), m_src_term_ref(Vocabulary::UNDEFINED_TERM_REF)
	{
		// <Term>src-term</Term>
		std::string term_id;
		if (! ConfigManager::getConfigOption(VALUE_ELEMENT_NAME, term_id, config_ptr))
			throw MissingTransformField("Missing Source-Term in TransformationAssignTerm");
		m_src_term_ref = v.findTerm(term_id);
		if (m_src_term_ref == Vocabulary::UNDEFINED_TERM_REF)
			throw MissingTransformField("Invalid Source-Term in TransformationAssignTerm");
	}

	/**
	 * transform Assigns a copy of the source term into the destination event/term
	 *
	 * @param d Destination event (pointer) to modify term
	 * @param s Source event to copy the termS/valueS from
	 *
	 * @return true if the Transformation occured; false if it did not
	 */
	virtual bool transform(EventPtr& d, const EventPtr& s)
	{
		bool AnyCopied = false;
		Event::ValuesRange values_range = s->equal_range(m_src_term_ref);
		for (Event::ConstIterator ec = values_range.first; ec != values_range.second; ec++) {
			std::string str;
			AnyCopied |= AssignValue(d, m_term, getStringValue(str, m_v[m_src_term_ref], ec));
		}
		return AnyCopied;	// true, if any were copied...
	}
};

/// TransformLookup -- Transformation based on doing lookups
class PION_PLATFORM_API TransformLookup
	: public Transform
{
	/// Define HashMapped, key-value pair array KVP
	typedef PION_HASH_MAP<std::string, std::string, PION_HASH_STRING>	KVP;

	/// Term to pull out of the source event
	Vocabulary::TermRef			m_lookup_term_ref;

	/// [optional] regular expression to apply to Lookup Term
	boost::regex				m_match;

	/// [optional] format to apply to regular expression, default: $&
	std::string					m_format;

	/// Treatment for default value, if lookup fails
	enum { DEF_UNDEF, DEF_SRCTERM, DEF_OUTPUT, DEF_FIXED }
								m_default;

	/// [optional] fixed string to use as default value with DEF_FIXED
	std::string					m_fixed;

	/// Keys & Values, hashmap for keys
	KVP							m_lookup;

	/// Is this rule running?
	bool						m_running;

public:

	/**
	 * TransformLookup constructs a transformation assignment based on a lookup set of values
	 *
	 * @param v Vocabulary to use
	 * @param term The source term type to use
	 * @param config_ptr Pointer to XML configuration of the Lookup entity
	 */
	TransformLookup(const Vocabulary& v, const Vocabulary::Term& term, const xmlNodePtr config_ptr)
		: Transform(v, term)
	{
		//	<LookupTerm>src-term</LookupTerm>
		std::string term_id;
		if (! ConfigManager::getConfigOption(LOOKUP_TERM_NAME, term_id, config_ptr))
			throw MissingTransformField("Missing LookupTerm in TransformationAssignLookup");
		m_lookup_term_ref = v.findTerm(term_id);
		if (m_lookup_term_ref == Vocabulary::UNDEFINED_TERM_REF)
			throw MissingTransformField("Invalid LookupTerm in TransformationAssignLookup");
		//[opt]		<Match>escape(regexp)</Match>
		std::string val;
		if (ConfigManager::getConfigOptionEmptyOk(LOOKUP_MATCH_ELEMENT_NAME, val, config_ptr)) {
			try {
				m_match = val;
			} catch (...) {
				throw MissingTransformField("Invalid regular expression in TransformationLookup: " + val);
			}
		}
		//	[opt]		<Format>escape(format)</Format>
		m_format.clear();
		if (ConfigManager::getConfigOptionEmptyOk(LOOKUP_FORMAT_ELEMENT_NAME, val, config_ptr))
			m_format = val;

		//	[opt]		<DefaultAction>leave-undefined|src-term|output|fixedvalue</DefaultAction>
		m_default = DEF_UNDEF;
		if (ConfigManager::getConfigOption(LOOKUP_DEFAULTACTION_ELEMENT_NAME, val, config_ptr)) {
			if (val == "src-term")
				m_default = DEF_SRCTERM;
			else if (val == "output")
				m_default = DEF_OUTPUT;
			else if (val == "fixedvalue")
				m_default = DEF_FIXED;
		}
		//	[opt]		<DefaultValue>escape(text)</DefaultValue>
		m_fixed.clear();
		if (m_default == DEF_FIXED && ConfigManager::getConfigOptionEmptyOk(LOOKUP_DEFAULT_ELEMENT_NAME, val, config_ptr))
			m_fixed = val;
		//	[rpt/]		<Lookup key="escape(key)">escape(value)</Lookup>
		xmlNodePtr LookupNode = config_ptr;
		while ( (LookupNode = ConfigManager::findConfigNodeByName(LOOKUP_LOOKUP_ELEMENT_NAME, LookupNode)) != NULL) {
			// get the value (element content)
			xmlChar *xml_char_ptr = xmlNodeGetContent(LookupNode);
			if (xml_char_ptr == NULL || xml_char_ptr[0]=='\0') {
				if (xml_char_ptr != NULL)
					xmlFree(xml_char_ptr);
				throw MissingTransformField("Missing Value in TransformationLookup");
			}
			const std::string val_str(reinterpret_cast<char*>(xml_char_ptr));
			xmlFree(xml_char_ptr);
			// next get the Term we want to map to
			xml_char_ptr = xmlGetProp(LookupNode, reinterpret_cast<const xmlChar*>(LOOKUP_KEY_ATTRIBUTE_NAME.c_str()));
			if (xml_char_ptr == NULL || xml_char_ptr[0]=='\0') {
				if (xml_char_ptr != NULL)
					xmlFree(xml_char_ptr);
				throw MissingTransformField("Missing Key in TransformationLookup");
			}
			const std::string key_str(reinterpret_cast<char*>(xml_char_ptr));
			xmlFree(xml_char_ptr);
			if (m_lookup.find(key_str) != m_lookup.end())
				throw MissingTransformField("Duplicate Key in TransformationLookup");
			m_lookup[key_str] = val_str;
			LookupNode = LookupNode->next;
		}
		if (m_lookup.empty())
			throw MissingTransformField("No Key-Values in TransformationLookup");

		m_running = true;
	}

	/// Destructor, to dispose of the lookup table
	virtual ~TransformLookup() {
		m_lookup.clear();
	}

	/**
	 * transform Assigns a value based on regex/lookup/default
	 *
	 * @param d Destination event (pointer) to modify term
	 * @param s Source event to use as basis for lookup
	 *
	 * @return true if the Transformation occured; false if it did not
	 */
	virtual bool transform(EventPtr& d, const EventPtr& s)
	{
		if (!m_running)
			return false;
		Event::ValuesRange values_range = s->equal_range(m_lookup_term_ref);
		Event::ConstIterator ec = values_range.first;
		// if ec == values_range.second ... source term was not found...
		bool AnyCopied = false;
		while (ec != values_range.second) {
			// Get the source term
			std::string str;
			getStringValue(str, m_v[m_lookup_term_ref], ec);
			// If regex defined, do the regular expression, replacing the key value
			if (! m_match.empty()) {
				try {
					str = boost::regex_replace(str, m_match, m_format, boost::format_all | boost::format_no_copy);
				} catch (...) {
					// Get the source string again
					getStringValue(str, m_v[m_lookup_term_ref], ec);
					// Not running anymore
					m_running = false;
					// Throw on this, to get an error message logged
					throw RegexFailure("str=" + str + ", regex=" + m_match.str());
				}
			}
			// Find the value, using the key
			KVP::const_iterator i = m_lookup.find(str);
			if (i != m_lookup.end())	// Found: assign the lookup value
				AnyCopied |= AssignValue(d, m_term, i->second);
			else						// Not found: perform default action
				switch (m_default) {
					case DEF_UNDEF:		// Leave undefined, i.e. do nothing
						break;
					case DEF_SRCTERM:	// Re-get the original value, assign it
						{
							std::string str;
							AnyCopied |= AssignValue(d, m_term, getStringValue(str, m_v[m_lookup_term_ref], ec));
						}
						break;
					case DEF_OUTPUT:	// Assign the regex output value
						AnyCopied |= AssignValue(d, m_term, str);
						break;
					case DEF_FIXED:		// Assign the fixed value
						AnyCopied |= AssignValue(d, m_term, m_fixed);
						break;
				}
			ec++;			// repeat for all matching source terms
		}
		return AnyCopied;	// true, if any were copied...
	}
};

/// TransformRules -- Transformation based on a full set of rules
class PION_PLATFORM_API TransformRules
	: public Transform
{
	/// Should TransformRules stop at first successfull transformation for this dest-term
	bool										m_short_circuit;

	/// set value, for assignment, or for use as format for TYPE_REGEX
	std::vector<std::string>					m_set_value;

	/// pointer to instantiated & configured Comparison
	std::vector<Comparison *>					m_comparison;

	/// are we running?
	std::vector<bool>							m_running;

public:

	/**
	 * TransformRules constructs a transformation assignment based on a set of Rules
	 *
	 * @param v Vocabulary to use
	 * @param term The source term type to use
	 * @param config_ptr Pointer to XML configuration of the Rules entity
	 */
	TransformRules(const Vocabulary& v, const Vocabulary::Term& term, const xmlNodePtr config_ptr)
		: Transform(v, term)
	{
		// <StopOnFirstMatch>true|false</StopOnFirstMatch>			-> DEFAULT: true
		m_short_circuit = false;
		std::string short_circuit_str;
		if (! ConfigManager::getConfigOption(RULES_STOP_ON_FIRST_ELEMENT_NAME, short_circuit_str, config_ptr))
			throw MissingTransformField("Missing StopOnFirstMatch in TransformationAssignRules");
		if (short_circuit_str == "true")
			m_short_circuit = true;

		//	[rpt]		<Rule>
		xmlNodePtr RuleNode = config_ptr;
		while ( (RuleNode = ConfigManager::findConfigNodeByName(RULE_ELEMENT_NAME, RuleNode)) != NULL)
		{
			//	<Term>src-term</Term>
			std::string term_id;
			if (! ConfigManager::getConfigOption(TERM_ELEMENT_NAME, term_id, RuleNode->children))
				throw MissingTransformField("Missing Source-Term in TransformationAssignRules");
			Vocabulary::TermRef term_ref = v.findTerm(term_id);
			if (term_ref == Vocabulary::UNDEFINED_TERM_REF)
				throw MissingTransformField("Invalid Term in TransformationAssignRules");

			//	<Type>test-type</Type>
			std::string val;
			if (! ConfigManager::getConfigOption(TYPE_ELEMENT_NAME, val, RuleNode->children))
				throw MissingTransformField("Missing Value in TransformationAssignRules");
			Comparison::ComparisonType ctype = Comparison::parseComparisonType(val);

			//	<Value>escape(test-value)</Value>
			std::string value_str;
			if (!Comparison::isGenericType(ctype))
				if (! ConfigManager::getConfigOptionEmptyOk(VALUE_ELEMENT_NAME, value_str, RuleNode->children))
					throw MissingTransformField("Missing Value in TransformationAssignRules");

			Comparison *comp = new Comparison(v[term_ref]);
			comp->configure(ctype, value_str);
			m_comparison.push_back(comp);

			//	<SetValue>escape(set-value)</SetValue>
			val.clear();
			if (! ConfigManager::getConfigOptionEmptyOk(TRANSFORMATION_SET_VALUE_NAME, val, RuleNode->children))
				throw MissingTransformField("Missing SetValue in TransformationAssignRules");
			m_set_value.push_back(val);

			// Set running state
			m_running.push_back(true);

			RuleNode = RuleNode->next;
		}
	}

	/// Destructor for TransformRules -- needed for clearing comparison objects
	virtual ~TransformRules() {
		for (unsigned int i = 0; i < m_comparison.size(); i++)
			delete m_comparison[i];
	}

	/**
	 * transform modifies the destination event, based on rules
	 *
	 * @param d Destination event (pointer) to modify term
	 * @param s Source event to copy the termS/valueS from
	 *
	 * @return true if the Transformation occured; false if it did not
	 */
	virtual bool transform(EventPtr& d, const EventPtr& s)
	{
		bool AnyAssigned = false;
		// Loop through all TESTs, break out if any term successful on any test and short_circuit
		for (unsigned int i = 0; i < m_comparison.size(); i++)
			if (m_running[i]) {
				switch (m_comparison[i]->getType()) {
					// We'll take out the cases where there might not be values to iterate through, and handle them individually.
					case Comparison::TYPE_IS_DEFINED:
						if (s->getType() == m_comparison[i]->getTerm().term_ref || s->isDefined(m_comparison[i]->getTerm().term_ref))
							AnyAssigned |= AssignValue(d, m_term, m_set_value[i]);
						break;
					case Comparison::TYPE_TRUE:
						AnyAssigned |= AssignValue(d, m_term, m_set_value[i]);
						break;
					case Comparison::TYPE_FALSE:
						break;
					case Comparison::TYPE_IS_NOT_DEFINED:
						if (! (s->getType() == m_comparison[i]->getTerm().term_ref || s->isDefined(m_comparison[i]->getTerm().term_ref)))
							AnyAssigned |= AssignValue(d, m_term, m_set_value[i]);
						break;
					default:
						{
							Event::ValuesRange values_range = s->equal_range(m_comparison[i]->getTerm().term_ref);
							for (Event::ConstIterator ec = values_range.first; ec != values_range.second; ec++)
								try {
									Event::ConstIterator ec_past = ec;
									if (m_comparison[i]->evaluateRange(std::make_pair(ec, ++ec_past))) {
										if (m_comparison[i]->getType() == Comparison::TYPE_REGEX) {		// Only for POSITIVE regex...
											// Get the original value
											// For Regex... get the precompiled from Comparison
											// For Format... use the set_value
											std::string str;
											str = boost::regex_replace(getStringValue(str, m_comparison[i]->getTerm(), ec), m_comparison[i]->getRegex(),
																		m_set_value[i], boost::format_all | boost::format_no_copy);
											// Assign the result
											AnyAssigned |= AssignValue(d, m_term, str);
										} else
											AnyAssigned |= AssignValue(d, m_term, m_set_value[i]);
									}
								} catch (...) {
									// Get the original value again...
									std::string str;
									// This rule won't be running again...
									m_running[i] = false;
									// Throw on this, to get an error message logged
									throw RegexFailure("str=" + getStringValue(str, m_comparison[i]->getTerm(), ec) + ", regex=" + m_comparison[i]->getRegex().str());
								}
						}
						break;
				}
				// If short_circuit AND any values were assigned -> don't go further in the chain
				if (m_short_circuit && AnyAssigned)
					break;
			}
		return AnyAssigned;
	}
};

/// TransformRegex -- Transformation based on a set of regexp's
class PION_PLATFORM_API TransformRegex
	: public Transform
{
	/// identifies the Vocabulary Term that is being copied from
	Vocabulary::TermRef							m_src_term_ref;

	/// set format for regex's
	std::vector<std::string>					m_format;

	/// regex's
	std::vector<boost::regex>					m_regex;

	/// Is still regex still alive?
	std::vector<bool>							m_running;

public:

	/**
	 * TransformRegex constructs a transformation assignment based on a series of consecutive regular expressions
	 *
	 * @param v Vocabulary to use
	 * @param term The source term type to use
	 * @param config_ptr Pointer to XML configuration of the Regex entity
	 */
	TransformRegex(const Vocabulary& v, const Vocabulary::Term& term, const xmlNodePtr config_ptr)
		: Transform(v, term)
	{
		//	<SourceTerm>src-term</SourceTerm>
		std::string term_id;
		if (! ConfigManager::getConfigOption(SOURCE_TERM_ELEMENT_NAME, term_id, config_ptr))
			throw MissingTransformField("Missing SourceTerm in TransformationRegex");
		m_src_term_ref = v.findTerm(term_id);
		if (m_src_term_ref == Vocabulary::UNDEFINED_TERM_REF)
			throw MissingTransformField("Invalid SourceTerm in TransformationRegex");
		xmlNodePtr RegexNode = config_ptr;
		while ( (RegexNode = ConfigManager::findConfigNodeByName(REGEXP_ELEMENT_NAME, RegexNode)) != NULL) {
			// get the FORMAT (element content)
			xmlChar *xml_char_ptr = xmlNodeGetContent(RegexNode);
			std::string val;
			if (xml_char_ptr != NULL && xml_char_ptr[0] != '\0')
				val = reinterpret_cast<char*>(xml_char_ptr);
			if (xml_char_ptr != NULL) xmlFree(xml_char_ptr);
			m_format.push_back(val);
			// next get the Term we want to map to
			xml_char_ptr = xmlGetProp(RegexNode, reinterpret_cast<const xmlChar*>(REGEXP_ATTRIBUTE_NAME.c_str()));
			if (xml_char_ptr == NULL || xml_char_ptr[0]=='\0') {
				if (xml_char_ptr != NULL)
					xmlFree(xml_char_ptr);
				throw MissingTransformField("Missing Regexp in TransformationRegex");
			}
			val = reinterpret_cast<char*>(xml_char_ptr);
			xmlFree(xml_char_ptr);
			boost::regex reg;
			try {
				reg = val;
			} catch (...) {
				throw MissingTransformField("Invalid regular expression in TransformationRegex");
			}
			m_regex.push_back(reg);
			m_running.push_back(true);
			RegexNode = RegexNode->next;
		}
		if (m_regex.empty())
			throw MissingTransformField("No Regexp's in TransformationRegex");
	}

	/// Destructor -- not needed
	virtual ~TransformRegex() {	}

	/**
	 * transform Adds a term to destination based on a series of successive regular expressions
	 *
	 * @param d Destination event (pointer) to modify term
	 * @param s Source event to copy the termS/valueS from
	 *
	 * @return true if the Transformation occured; false if it did not
	 */
	virtual bool transform(EventPtr& d, const EventPtr& s)
	{
		bool AnyAssigned = false;
		// Iterate through all values from source term
		Event::ValuesRange values_range = s->equal_range(m_src_term_ref);
		for (Event::ConstIterator ec = values_range.first; ec != values_range.second; ec++) {
			// Take the original value from source term set
			std::string str;
			getStringValue(str, m_v[m_src_term_ref], ec);
			// Run through all regexp's
			for (unsigned int i = 0; i < m_regex.size(); i++)
				if (m_running[i]) {
					std::string res;
					try {
						res = boost::regex_replace(str, m_regex[i], m_format[i], boost::format_all | boost::format_no_copy);
					} catch (...) {
						// This rule won't be running again...
						m_running[i] = false;
						// Throw on this, to get an error message logged
						throw RegexFailure("str=" + str + ", regex=" + m_regex[i].str());
					}
					if (!res.empty())
						str = res;
				}
			AnyAssigned |= AssignValue(d, m_term, str);
		}
		return AnyAssigned;
	}
};


}
}


#endif
