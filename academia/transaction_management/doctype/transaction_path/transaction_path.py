# Copyright (c) 2024, SanU and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class TransactionPath(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		has_sign: DF.Check
		is_received: DF.Check
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		recipient_designation: DF.Link
		step: DF.Int
		will_print_paper: DF.Check
	# end: auto-generated types
	pass
