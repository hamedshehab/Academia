// Copyright (c) 2024, SanU Development Team and contributors
// For license information, please see license.txt

frappe.ui.form.on("Transaction Category", {
	setup: function (frm) {
		// Changing Button Style
		$(`<style>
          .btn[data-fieldname="get_recipients"] {
            background-color: #171717; /* Custom dark gray */
            color: white;
          }
          .btn[data-fieldname="get_recipients"]:hover {
            background-color: #171710 !important;/* Slightly darker gray for interaction states */
            color: white !important;
          }

          .btn[data-fieldname="refresh_button"] {
            background-color: #171717; /* Custom dark gray */
            color: white;
          }
          .btn[data-fieldname="refresh_button"]:hover {
            background-color: #171710 !important;/* Slightly darker gray for interaction states */
            color: white !important;
          }
            </style>`).appendTo("head");

		// Hide 'add row' button
		frm.get_field("path").grid.cannot_add_rows = true;
		// Stop 'add below' & 'add above' options
		frm.get_field("path").grid.only_sortable();
		frm.refresh_field("path");
	},

	refresh: function (frm) {
		// Filter the "Parent Transaction Category" field choices
		frm.fields_dict["parent_category"].get_query = function (doc, cdt, cdn) {
			return {
				filters: [
					["Transaction Category", "is_group", "=", 1],
					["Transaction Category", "parent_category", "=", ""], // Only show parties without a parent
					["Transaction Category", "company", "=", doc.company],
				],
			};
		};
	},

	// validate: function(frm) {
	//     // Validation for is_group checkbox
	//     if (frm.doc.is_group) {
	//         // If is_group is checked, clear the parent_category field
	//         frm.set_value('parent_category', null);
	//         frm.refresh_field('parent_category');
	//     } else {
	//         // If is_group is not checked, ensure parent_category is not empty
	//         if (!frm.doc.parent_category) {
	//             frappe.throw(__("Parent Category is mandatory if 'Is Group' is not checked."));
	//         }
	//     }
	// },

	// Advance Get members Dialog
	get_recipients: function (frm) {
		var setters = {
			designation_name: null,
		};

		let existingRecipients = frm.doc.recipients || [];
		let existingRecipientIds = existingRecipients.map((r) => r.recipient_email);

		let d = new frappe.ui.form.MultiSelectDialog({
			doctype: "Designation",
			target: frm,
			setters: setters,

			// add_filters_group: 1,
			date_field: "transaction_date",

			get_query() {
				let filters = {};

				return {
					filters: filters,
				};
			},

			primary_action_label: "Get Recipients",
			action(selections) {
				// Fetch the selected employees with specific fields
				frappe.call({
					method: "frappe.client.get_list",
					args: {
						doctype: "Designation",
						filters: { name: ["in", selections] },
						fields: ["designation_name"],
					},
					callback: (response) => {
						var selectedEmployees = response.message;

						selectedEmployees.forEach((designation) => {
							frm.add_child("path", {
								recipient_designation: designation.designation_name,
							});
						});

						this.dialog.hide();
						frm.refresh_field("path");
					},
				});
			},
		});
	},

	clear_recipients: function (frm) {
		frm.clear_table("path");
		frm.refresh_field("path");
	},
});
